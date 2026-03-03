package handlers

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PackagesHandler struct {
	DB *gorm.DB
}

func getUserID(c *gin.Context) (uuid.UUID, error) {
	raw, exists := c.Get("user_id")
	if !exists {
		return uuid.Nil, errors.New("user_id not found in context")
	}
	idStr, ok := raw.(string)
	if !ok {
		return uuid.Nil, errors.New("user_id has unexpected type in context")
	}
	return uuid.Parse(idStr)
}

const (
	StatusDraft     = "draft"
	StatusPublished = "published"
	StatusArchived  = "archived"
)

var validTransitions = map[string][]string{
	StatusDraft:     {StatusPublished, StatusArchived},
	StatusPublished: {StatusArchived},
	StatusArchived:  {},
}

func isValidTransition(from, to string) bool {
	allowed, ok := validTransitions[from]
	if !ok {
		return false
	}
	for _, s := range allowed {
		if s == to {
			return true
		}
	}
	return false
}

func (h *PackagesHandler) CreatePackage(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var req PackageCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var itinerary models.Itinerary
	if err := h.DB.Preload("Items").
		First(&itinerary, "itinerary_id = ? AND user_id = ?", req.ItineraryID, userID).
		Error; err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "Itinerary not found or you do not own it"})
		return
	}

	newPackage := models.Package{
		CreatorID:   userID,
		ItineraryID: req.ItineraryID,
		Title:       req.Title,
		Summary:     req.Summary,
		Price:       req.Price,
		Status:      StatusDraft,
	}

	if err := h.DB.Create(&newPackage).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create package"})
		return
	}

	c.JSON(http.StatusCreated, newPackage)
}

func (h *PackagesHandler) PublishPackage(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	packageID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid package ID"})
		return
	}

	var pkg models.Package
	if err := h.DB.First(&pkg, "package_id = ?", packageID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Package not found"})
		return
	}

	if pkg.CreatorID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not the creator of this package"})
		return
	}

	if !isValidTransition(pkg.Status, StatusPublished) {
		c.JSON(http.StatusConflict, gin.H{
			"error":          "Invalid status transition",
			"current_status": pkg.Status,
			"allowed_from":   "draft",
		})
		return
	}

	var itemCount int64
	if err := h.DB.Model(&models.ItineraryItem{}).
		Where("itinerary_id = ?", pkg.ItineraryID).
		Count(&itemCount).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count itinerary items"})
		return
	}

	if itemCount < 3 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":      "Package cannot be published: the linked itinerary must have at least 3 items",
			"item_count": itemCount,
			"required":   3,
		})
		return
	}

	if err := h.DB.Model(&pkg).Update("status", StatusPublished).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to publish package"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Package published successfully",
		"package": pkg,
	})
}

func (h *PackagesHandler) UpdatePackageStatus(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	packageID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid package ID"})
		return
	}

	var req PackageStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var pkg models.Package
	if err := h.DB.First(&pkg, "package_id = ?", packageID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Package not found"})
		return
	}

	if pkg.CreatorID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not the creator of this package"})
		return
	}

	if !isValidTransition(pkg.Status, req.Status) {
		c.JSON(http.StatusConflict, gin.H{
			"error":          "Invalid status transition",
			"current_status": pkg.Status,
			"requested":      req.Status,
		})
		return
	}

	if req.Status == StatusPublished {
		var itemCount int64
		if err := h.DB.Model(&models.ItineraryItem{}).
			Where("itinerary_id = ?", pkg.ItineraryID).
			Count(&itemCount).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count itinerary items"})
			return
		}
		if itemCount < 3 {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":      "The linked itinerary must have at least 3 items to publish",
				"item_count": itemCount,
			})
			return
		}
	}

	if err := h.DB.Model(&pkg).Update("status", req.Status).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update package status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "Status updated successfully",
		"package_id": pkg.PackageID,
		"new_status": req.Status,
	})
}

func (h *PackagesHandler) UpdatePackage(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	packageID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid package ID"})
		return
	}

	var req PackageUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.Title == nil && req.Summary == nil && req.Price == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No fields provided to update"})
		return
	}

	var pkg models.Package
	if err := h.DB.First(&pkg, "package_id = ?", packageID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Package not found"})
		return
	}

	if pkg.CreatorID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not the creator of this package"})
		return
	}

	if pkg.Status == StatusArchived {
		c.JSON(http.StatusConflict, gin.H{"error": "Archived packages cannot be updated"})
		return
	}

	updates := map[string]interface{}{}
	if req.Title != nil {
		trimmed := strings.TrimSpace(*req.Title)
		if trimmed == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Title cannot be empty"})
			return
		}
		updates["title"] = trimmed
	}
	if req.Summary != nil {
		updates["summary"] = strings.TrimSpace(*req.Summary)
	}
	if req.Price != nil {
		updates["price"] = *req.Price
	}

	if err := h.DB.Model(&pkg).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update package"})
		return
	}

	if err := h.DB.First(&pkg, "package_id = ?", packageID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load updated package"})
		return
	}

	c.JSON(http.StatusOK, pkg)
}

func (h *PackagesHandler) ArchivePackage(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	packageID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid package ID"})
		return
	}

	var pkg models.Package
	if err := h.DB.First(&pkg, "package_id = ?", packageID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Package not found"})
		return
	}

	if pkg.CreatorID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not the creator of this package"})
		return
	}

	if !isValidTransition(pkg.Status, StatusArchived) {
		c.JSON(http.StatusConflict, gin.H{
			"error":          "Invalid status transition",
			"current_status": pkg.Status,
		})
		return
	}

	if err := h.DB.Model(&pkg).Update("status", StatusArchived).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to archive package"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "Package archived successfully",
		"package_id": pkg.PackageID,
		"new_status": StatusArchived,
	})
}

func (h *PackagesHandler) SubmitPackageReview(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	packageID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid package ID"})
		return
	}

	var req ReviewRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var pkg models.Package
	if err := h.DB.First(&pkg, "package_id = ?", packageID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Package not found"})
		return
	}
	if pkg.Status != StatusPublished {
		c.JSON(http.StatusBadRequest, gin.H{"error": "You can only review published packages"})
		return
	}

	var existing models.PackageReview
	if err := h.DB.First(&existing, "package_id = ? AND user_id = ?", packageID, userID).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "You have already reviewed this package"})
		return
	}

	txErr := h.DB.Transaction(func(tx *gorm.DB) error {
		review := models.PackageReview{
			PackageID: packageID,
			UserID:    userID,
			Rating:    req.Rating,
			Comment:   req.Comment,
		}
		if err := tx.Create(&review).Error; err != nil {
			return err
		}

		var stats struct {
			Avg   float64
			Count int64
		}
		if err := tx.Model(&models.PackageReview{}).
			Select("ROUND(AVG(rating)::numeric, 2) as avg, COUNT(*) as count").
			Where("package_id = ?", packageID).
			Scan(&stats).Error; err != nil {
			return err
		}

		return tx.Model(&models.Package{}).
			Where("package_id = ?", packageID).
			Updates(map[string]interface{}{
				"rating_avg":    stats.Avg,
				"reviews_count": stats.Count,
			}).Error
	})

	if txErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit review"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Review submitted successfully"})
}

func (h *PackagesHandler) GetPackageReviews(c *gin.Context) {
	packageID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid package ID"})
		return
	}

	var reviews []models.PackageReview
	if err := h.DB.
		Where("package_id = ?", packageID).
		Order("created_at DESC").
		Limit(50).
		Find(&reviews).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch reviews"})
		return
	}

	c.JSON(http.StatusOK, reviews)
}

func (h *PackagesHandler) GetPackagesFeed(c *gin.Context) {
	sortBy := c.DefaultQuery("sort_by", "rating_avg")
	order := c.DefaultQuery("order", "desc")
	queryText := strings.TrimSpace(c.Query("q"))
	minPriceStr := c.Query("min_price")
	maxPriceStr := c.Query("max_price")
	minRatingStr := c.Query("min_rating")
	minReviewsStr := c.Query("min_reviews")
	creatorIDStr := strings.TrimSpace(c.Query("creator_id"))

	allowedSortColumns := map[string]string{
		"rating_avg": "rating_avg",
		"price":      "price",
		"verified":   "reviews_count",
	}
	sortColumn, ok := allowedSortColumns[sortBy]
	if !ok {
		sortColumn = "rating_avg"
	}
	if order != "asc" && order != "desc" {
		order = "desc"
	}
	orderClause := sortColumn + " " + order

	if sortColumn != "rating_avg" {
		orderClause += ", rating_avg DESC"
	} else {
		orderClause += ", reviews_count DESC"
	}

	page := 1
	pageSize := 20
	if p, err := parseInt(c.Query("page")); err == nil && p > 0 {
		page = p
	}
	if ps, err := parseInt(c.Query("page_size")); err == nil && ps > 0 && ps <= 100 {
		pageSize = ps
	}
	offset := (page - 1) * pageSize

	var packages []models.Package
	var total int64

	query := h.DB.Model(&models.Package{}).Where("status = ?", StatusPublished)

	if queryText != "" {
		like := "%" + queryText + "%"
		query = query.Where("title ILIKE ? OR summary ILIKE ?", like, like)
	}
	if creatorIDStr != "" {
		creatorID, err := uuid.Parse(creatorIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid creator_id"})
			return
		}
		query = query.Where("creator_id = ?", creatorID)
	}

	var minPrice, maxPrice float64
	if minPriceStr != "" {
		v, err := parseFloat(minPriceStr)
		if err != nil || v < 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid min_price"})
			return
		}
		minPrice = v
		query = query.Where("price >= ?", minPrice)
	}
	if maxPriceStr != "" {
		v, err := parseFloat(maxPriceStr)
		if err != nil || v < 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid max_price"})
			return
		}
		maxPrice = v
		query = query.Where("price <= ?", maxPrice)
	}
	if minPriceStr != "" && maxPriceStr != "" && minPrice > maxPrice {
		c.JSON(http.StatusBadRequest, gin.H{"error": "min_price cannot be greater than max_price"})
		return
	}
	if minRatingStr != "" {
		v, err := parseFloat(minRatingStr)
		if err != nil || v < 0 || v > 5 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid min_rating"})
			return
		}
		query = query.Where("rating_avg >= ?", v)
	}
	if minReviewsStr != "" {
		v, err := parseInt(minReviewsStr)
		if err != nil || v < 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid min_reviews"})
			return
		}
		query = query.Where("reviews_count >= ?", v)
	}

	if err := query.Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count packages"})
		return
	}

	if err := query.
		Order(orderClause).
		Limit(pageSize).
		Offset(offset).
		Find(&packages).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch packages feed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": packages,
		"meta": gin.H{
			"page":      page,
			"page_size": pageSize,
			"total":     total,
			"sort_by":   sortBy,
			"order":     order,
		},
	})
}

func (h *PackagesHandler) PostChatMessage(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	packageID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid package ID"})
		return
	}

	var req ChatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var pkg models.Package
	if err := h.DB.First(&pkg, "package_id = ?", packageID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Package not found"})
		return
	}

	chatMsg := models.PackageChat{
		PackageID: packageID,
		UserID:    userID,
		Message:   req.Message,
	}

	if err := h.DB.Create(&chatMsg).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to post message"})
		return
	}

	if GlobalHub != nil {
		GlobalHub.BroadcastToPackage(packageID, chatMsg)
	}

	c.JSON(http.StatusCreated, chatMsg)
}

func (h *PackagesHandler) GetChatHistory(c *gin.Context) {
	packageID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid package ID"})
		return
	}

	page := 1
	pageSize := 50
	if p, err := parseInt(c.Query("page")); err == nil && p > 0 {
		page = p
	}
	if ps, err := parseInt(c.Query("page_size")); err == nil && ps > 0 && ps <= 200 {
		pageSize = ps
	}
	offset := (page - 1) * pageSize

	var messages []models.PackageChat
	var total int64

	if err := h.DB.Model(&models.PackageChat{}).Where("package_id = ?", packageID).Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count chat messages"})
		return
	}

	if err := h.DB.
		Where("package_id = ?", packageID).
		Order("created_at ASC").
		Limit(pageSize).
		Offset(offset).
		Find(&messages).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch chat history"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": messages,
		"meta": gin.H{
			"page":      page,
			"page_size": pageSize,
			"total":     total,
		},
	})
}

func (h *PackagesHandler) GetPackage(c *gin.Context) {
	packageID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid package ID"})
		return
	}

	var pkg models.Package
	if err := h.DB.First(&pkg, "package_id = ?", packageID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Package not found"})
		return
	}

	c.JSON(http.StatusOK, pkg)
}

func parseInt(s string) (int, error) {
	if s == "" {
		return 0, errors.New("empty string")
	}
	var n int
	_, err := fmt.Sscan(s, &n)
	return n, err
}

func parseFloat(s string) (float64, error) {
	if s == "" {
		return 0, errors.New("empty string")
	}
	var n float64
	_, err := fmt.Sscan(s, &n)
	return n, err
}
