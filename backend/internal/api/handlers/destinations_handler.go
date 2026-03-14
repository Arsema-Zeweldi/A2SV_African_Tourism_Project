package handlers

import (
	"net/http"
	"strings"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (h *AppHandler) CreateDestination(c *gin.Context) {
	var req CreateDestinationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	countryID, err := uuid.Parse(req.CountryID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid country_id"})
		return
	}
	regionID, err := uuid.Parse(req.RegionID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid region_id"})
		return
	}

	dest := models.Destination{
		DestinationID:    uuid.New(),
		Name:             strings.TrimSpace(req.Name),
		Slug:             strings.TrimSpace(req.Slug),
		Description:      strings.TrimSpace(req.Description),
		ShortDescription: strings.TrimSpace(req.ShortDescription),
		CountryID:        countryID,
		RegionID:         regionID,
		City:             strings.TrimSpace(req.City),
		Latitude:         req.Latitude,
		Longitude:        req.Longitude,
		DestinationType:  strings.TrimSpace(req.DestinationType),
		HeroImageURL:     strings.TrimSpace(req.HeroImageURL),
		BestSeason:       strings.TrimSpace(req.BestSeason),
	}
	if req.AnnualVisitors != nil {
		dest.AnnualVisitors = *req.AnnualVisitors
	}
	if req.PriceLevel != nil {
		dest.PriceLevel = *req.PriceLevel
	}
	if req.IsUnescoSite != nil {
		dest.IsUnescoSite = *req.IsUnescoSite
	}
	if req.IsActive != nil {
		dest.IsActive = *req.IsActive
	}

	if err := h.DB.Create(&dest).Error; err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Failed to create destination"})
		return
	}

	c.JSON(http.StatusCreated, dest)
}

func (h *AppHandler) UpdateDestination(c *gin.Context) {
	destID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid destination ID"})
		return
	}

	var req UpdateDestinationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updates := map[string]interface{}{}
	if req.Name != nil {
		updates["name"] = strings.TrimSpace(*req.Name)
	}
	if req.Slug != nil {
		updates["slug"] = strings.TrimSpace(*req.Slug)
	}
	if req.Description != nil {
		updates["description"] = strings.TrimSpace(*req.Description)
	}
	if req.ShortDescription != nil {
		updates["short_description"] = strings.TrimSpace(*req.ShortDescription)
	}
	if req.CountryID != nil {
		uid, err := uuid.Parse(*req.CountryID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid country_id"})
			return
		}
		updates["country_id"] = uid
	}
	if req.RegionID != nil {
		uid, err := uuid.Parse(*req.RegionID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid region_id"})
			return
		}
		updates["region_id"] = uid
	}
	if req.City != nil {
		updates["city"] = strings.TrimSpace(*req.City)
	}
	if req.Latitude != nil {
		updates["latitude"] = *req.Latitude
	}
	if req.Longitude != nil {
		updates["longitude"] = *req.Longitude
	}
	if req.DestinationType != nil {
		updates["destination_type"] = strings.TrimSpace(*req.DestinationType)
	}
	if req.HeroImageURL != nil {
		updates["hero_image_url"] = strings.TrimSpace(*req.HeroImageURL)
	}
	if req.AnnualVisitors != nil {
		updates["annual_visitors"] = *req.AnnualVisitors
	}
	if req.BestSeason != nil {
		updates["best_season"] = strings.TrimSpace(*req.BestSeason)
	}
	if req.PriceLevel != nil {
		updates["price_level"] = *req.PriceLevel
	}
	if req.IsUnescoSite != nil {
		updates["is_unesco_site"] = *req.IsUnescoSite
	}
	if req.IsActive != nil {
		updates["is_active"] = *req.IsActive
	}

	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No fields provided to update"})
		return
	}

	res := h.DB.Model(&models.Destination{}).Where("destination_id = ?", destID).Updates(updates)
	if res.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update destination"})
		return
	}
	if res.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Destination not found"})
		return
	}

	var dest models.Destination
	if err := h.DB.First(&dest, "destination_id = ?", destID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load updated destination"})
		return
	}

	c.JSON(http.StatusOK, dest)
}

func (h *AppHandler) DeleteDestination(c *gin.Context) {
	destID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid destination ID"})
		return
	}

	res := h.DB.Delete(&models.Destination{}, "destination_id = ?", destID)
	if res.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete destination"})
		return
	}
	if res.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Destination not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Destination deleted successfully"})
}
