package handlers

import (
	"context"
	"net/http"
	"strings"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/config"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/service/itinerary"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/service/packages"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/service/upload"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PackagesHandler struct {
	DB             *gorm.DB
	Cfg            *config.Config
	PackageService packages.PackageService
	ItinerarySvc   itinerary.ItineraryService
	UploadSvc      upload.UploadService
}

// NewPackagesHandler creates a new instance of PackagesHandler.
func NewPackagesHandler(db *gorm.DB, cfg *config.Config, pkgSvc packages.PackageService, itinSvc itinerary.ItineraryService, uploadSvc upload.UploadService) *PackagesHandler {
	return &PackagesHandler{
		DB:             db,
		Cfg:            cfg,
		PackageService: pkgSvc,
		ItinerarySvc:   itinSvc,
		UploadSvc:      uploadSvc,
	}
}



// Constants for package status to keep logic consistent
const (
	StatusPrivate  = "private"
	StatusPublic   = "public"
	StatusArchived = "archived"
)

var validTransitions = map[string][]string{
	StatusPrivate: {StatusPublic, StatusArchived},
	StatusPublic:  {StatusArchived},
	StatusArchived: {},
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
	if h.PackageService == nil || h.ItinerarySvc == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Service not configured"})
		return
	}

	var req PackageCreateRequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ID: 3 - Handle optional image upload
	imageURL := ""
	file, err := c.FormFile("image")
	if err == nil {
		f, err := file.Open()
		if err == nil {
			defer f.Close()
			if h.UploadSvc != nil {
				url, err := h.UploadSvc.UploadImage(c.Request.Context(), f, "packages")
				if err == nil {
					imageURL = url
				}
			}
		}
	}

	itinerary, err := h.ItinerarySvc.GetByID(c.Request.Context(), req.ItineraryID)
	if err != nil || itinerary.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Itinerary not found or you do not own it"})
		return
	}

	newPackage := models.Package{
		CreatorID:   userID,
		ItineraryID: req.ItineraryID,
		Title:       req.Title,
		Summary:     req.Summary,
		Description: req.Description,
		Price:       req.Price,
		Status:      StatusPrivate,
	}
	if req.Country != "" {
		newPackage.Country = req.Country
	}
	if req.Location != "" {
		newPackage.Location = req.Location
	}
	if req.Currency != "" {
		newPackage.Currency = req.Currency
	}
	if req.ImageURL != "" {
		newPackage.ImageURL = req.ImageURL
	}
	if req.DurationDays > 0 {
		newPackage.DurationDays = req.DurationDays
	}
	if req.Category != "" {
		newPackage.Category = req.Category
	}
	if req.GroupSize != "" {
		newPackage.GroupSize = req.GroupSize
	}
	if req.IsPublic != nil {
		newPackage.IsPublic = *req.IsPublic
	}

	if err := h.PackageService.Create(c.Request.Context(), &newPackage, imageURL); err != nil {
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

	if h.PackageService == nil || h.ItinerarySvc == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Service not configured"})
		return
	}

	pkg, err := h.PackageService.GetByID(c.Request.Context(), packageID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Package not found"})
		return
	}

	if pkg.CreatorID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not the creator of this package"})
		return
	}

	if !isValidTransition(pkg.Status, StatusPublic) {
		c.JSON(http.StatusConflict, gin.H{
			"error":          "Invalid status transition",
			"current_status": pkg.Status,
			"allowed_from":   "private",
		})
		return
	}

	itinerary, err := h.ItinerarySvc.GetByID(c.Request.Context(), pkg.ItineraryID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load itinerary"})
		return
	}

	if len(itinerary.Activities) < 3 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":          "Package cannot be set to public: the linked itinerary must have at least 3 activities",
			"activity_count": len(itinerary.Activities),
			"required":       3,
		})
		return
	}

	if err := h.PackageService.UpdateStatus(c.Request.Context(), packageID, StatusPublic); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to publish package"})
		return
	}
	pkg.Status = StatusPublic

	c.JSON(http.StatusOK, gin.H{
		"message": "Package is now public",
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

	if h.PackageService == nil || h.ItinerarySvc == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Service not configured"})
		return
	}

	pkg, err := h.PackageService.GetByID(c.Request.Context(), packageID)
	if err != nil {
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

	if req.Status == StatusPublic {
		itinerary, err := h.ItinerarySvc.GetByID(c.Request.Context(), pkg.ItineraryID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load itinerary"})
			return
		}
		if len(itinerary.Activities) < 3 {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":          "The linked itinerary must have at least 3 activities to publish",
				"activity_count": len(itinerary.Activities),
			})
			return
		}
	}

	if err := h.PackageService.UpdateStatus(c.Request.Context(), packageID, req.Status); err != nil {
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
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ID: 4 - Handle optional image update
	imageURL := ""
	file, err := c.FormFile("image")
	if err == nil {
		f, err := file.Open()
		if err == nil {
			defer f.Close()
			if h.UploadSvc != nil {
				url, err := h.UploadSvc.UploadImage(c.Request.Context(), f, "packages")
				if err == nil {
					imageURL = url
				}
			}
		}
	}

	if req.Title == nil && req.Summary == nil && req.Description == nil && req.Price == nil &&
		req.Country == nil && req.Location == nil && req.Currency == nil && req.ImageURL == nil &&
		req.DurationDays == nil && req.Category == nil && req.GroupSize == nil && req.IsPublic == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No fields provided to update"})
		return
	}

	if h.PackageService == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Service not configured"})
		return
	}

	pkg, err := h.PackageService.GetByID(c.Request.Context(), packageID)
	if err != nil {
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
	if req.Description != nil {
		updates["description"] = strings.TrimSpace(*req.Description)
	}
	if req.Price != nil {
		updates["price"] = *req.Price
	}
	if req.Country != nil {
		updates["country"] = strings.TrimSpace(*req.Country)
	}
	if req.Location != nil {
		updates["location"] = strings.TrimSpace(*req.Location)
	}
	if req.Currency != nil {
		updates["currency"] = strings.TrimSpace(*req.Currency)
	}
	if req.ImageURL != nil {
		updates["image_url"] = strings.TrimSpace(*req.ImageURL)
	}
	if req.DurationDays != nil {
		updates["duration_days"] = *req.DurationDays
	}
	if req.Category != nil {
		updates["category"] = strings.TrimSpace(*req.Category)
	}
	if req.GroupSize != nil {
		updates["group_size"] = strings.TrimSpace(*req.GroupSize)
	}
	if req.IsPublic != nil {
		updates["is_public"] = *req.IsPublic
	}

	if err := h.PackageService.Update(c.Request.Context(), packageID, updates, imageURL); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update package"})
		return
	}

	updated, err := h.PackageService.GetByID(c.Request.Context(), packageID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load updated package"})
		return
	}

	c.JSON(http.StatusOK, updated)
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

	if h.PackageService == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Service not configured"})
		return
	}

	pkg, err := h.PackageService.GetByID(c.Request.Context(), packageID)
	if err != nil {
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

	if err := h.PackageService.UpdateStatus(c.Request.Context(), packageID, StatusArchived); err != nil {
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

	if h.PackageService == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Service not configured"})
		return
	}

	pkg, err := h.PackageService.GetByID(c.Request.Context(), packageID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Package not found"})
		return
	}
	if pkg.Status != StatusPublic {
		c.JSON(http.StatusBadRequest, gin.H{"error": "You can only review public packages"})
		return
	}

	review := models.PackageReview{
		PackageID: packageID,
		UserID:    userID,
		Rating:    req.Rating,
		Comment:   req.Comment,
	}
	avg, count, err := h.PackageService.SubmitReview(c.Request.Context(), &review)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":       "Review submitted successfully",
		"rating_avg":    avg,
		"reviews_count": count,
	})
}

func (h *PackagesHandler) GetPackageReviews(c *gin.Context) {
	packageID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid package ID"})
		return
	}
	if h.PackageService == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Service not configured"})
		return
	}

	reviews, _, err := h.PackageService.GetReviews(c.Request.Context(), packageID, packages.ReviewParams{Page: 1, PageSize: 50})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch reviews"})
		return
	}

	c.JSON(http.StatusOK, reviews)
}

func (h *PackagesHandler) GetPackagesFeed(c *gin.Context) {
	sortBy := c.DefaultQuery("sort_by", "rating_avg")
	order := c.DefaultQuery("order", "desc")
	status := strings.ToLower(strings.TrimSpace(c.DefaultQuery("status", StatusPublic)))
	queryText := strings.TrimSpace(c.Query("q"))
	minPriceStr := c.Query("min_price")
	maxPriceStr := c.Query("max_price")
	minRatingStr := c.Query("min_rating")
	minReviewsStr := c.Query("min_reviews")
	creatorIDStr := strings.TrimSpace(c.Query("creator_id"))

	allowedSortColumns := map[string]string{
		"rating_avg": "rating_avg",
		"price":      "price",
		"verified":   "reviews",
		"views":      "views",
	}
	if mapped, ok := allowedSortColumns[sortBy]; ok {
		sortBy = mapped
	} else {
		sortBy = "rating_avg"
	}
	if order != "asc" && order != "desc" {
		order = "desc"
	}

	page := 1
	pageSize := 20
	if p, err := parseInt(c.Query("page")); err == nil && p > 0 {
		page = p
	}
	if ps, err := parseInt(c.Query("page_size")); err == nil && ps > 0 && ps <= 100 {
		pageSize = ps
	}


	if status == "" {
		status = StatusPublic
	}
	var creatorID *uuid.UUID
	if status != StatusPublic { // Fix-ID: 1 - Changed "non-published" to "private"
		userID, err := getUserID(c)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization required to view private packages"}) // Fix-ID: 1
			return
		}
		creatorID = &userID
	}

	if creatorIDStr != "" {
		parsedID, err := uuid.Parse(creatorIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid creator_id"})
			return
		}
		creatorID = &parsedID
	}

	var minPrice, maxPrice *float64
	if minPriceStr != "" {
		v, err := parseFloat(minPriceStr)
		if err != nil || v < 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid min_price"})
			return
		}
		minPrice = &v
	}
	if maxPriceStr != "" {
		v, err := parseFloat(maxPriceStr)
		if err != nil || v < 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid max_price"})
			return
		}
		maxPrice = &v
	}
	if minPrice != nil && maxPrice != nil && *minPrice > *maxPrice {
		c.JSON(http.StatusBadRequest, gin.H{"error": "min_price cannot be greater than max_price"})
		return
	}
	var minRating *float64
	if minRatingStr != "" {
		v, err := parseFloat(minRatingStr)
		if err != nil || v < 0 || v > 5 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid min_rating"})
			return
		}
		minRating = &v
	}
	var minReviews *int
	if minReviewsStr != "" {
		v, err := parseInt(minReviewsStr)
		if err != nil || v < 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid min_reviews"})
			return
		}
		minReviews = &v
	}
	if h.PackageService == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Service not configured"})
		return
	}

	packagesList, total, err := h.PackageService.GetFeed(c.Request.Context(), packages.FeedParams{
		Page:       page,
		PageSize:   pageSize,
		Status:     status,
		CreatorID:  creatorID,
		Query:      queryText,
		MinPrice:   minPrice,
		MaxPrice:   maxPrice,
		MinRating:  minRating,
		MinReviews: minReviews,
		SortBy:     sortBy,
		Order:      order,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch packages feed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": packagesList,
		"meta": gin.H{
			"page":      page,
			"page_size": pageSize,
			"total":     total,
			"sort_by":   sortBy,
			"order":     order,
		},
	})
}

func (h *PackagesHandler) GetPackage(c *gin.Context) {
	packageID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid package ID"})
		return
	}
	if h.PackageService == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Service not configured"})
		return
	}

	pkg, err := h.PackageService.GetByID(c.Request.Context(), packageID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Package not found"})
		return
	}

	// Increment view count asynchronously to not block the response
	go func(id uuid.UUID) {
		_ = h.PackageService.IncrementViews(context.Background(), id)
	}(pkg.PackageID)

	c.JSON(http.StatusOK, pkg)
}


