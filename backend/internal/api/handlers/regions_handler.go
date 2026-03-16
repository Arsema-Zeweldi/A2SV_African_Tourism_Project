package handlers

import (
	"errors"
	"net/http"
	"strings"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgconn"
)

func (h *AppHandler) ListRegions(c *gin.Context) {
	var regions []models.Region
	if err := h.DB.Order("name ASC").Find(&regions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch regions"})
		return
	}
	c.JSON(http.StatusOK, regions)
}

func (h *AppHandler) CreateRegion(c *gin.Context) {
	var req CreateRegionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	region := models.Region{
		RegionID:    uuid.New(),
		Name:        strings.TrimSpace(req.Name),
		Slug:        strings.TrimSpace(req.Slug),
		Description: strings.TrimSpace(req.Description),
	}

	if err := h.DB.Create(&region).Error; err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Failed to create region"})
		return
	}

	c.JSON(http.StatusCreated, region)
}

func (h *AppHandler) GetRegion(c *gin.Context) {
	regionID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid region ID"})
		return
	}

	var region models.Region
	if err := h.DB.First(&region, "region_id = ?", regionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Region not found"})
		return
	}

	c.JSON(http.StatusOK, region)
}

func (h *AppHandler) UpdateRegion(c *gin.Context) {
	regionID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid region ID"})
		return
	}

	var req UpdateRegionRequest
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

	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No fields provided to update"})
		return
	}

	res := h.DB.Model(&models.Region{}).Where("region_id = ?", regionID).Updates(updates)
	if res.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update region"})
		return
	}
	if res.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Region not found"})
		return
	}

	h.GetRegion(c)
}

func (h *AppHandler) DeleteRegion(c *gin.Context) {
	regionID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid region ID"})
		return
	}

	res := h.DB.Delete(&models.Region{}, "region_id = ?", regionID)
	if res.Error != nil {
		var pgErr *pgconn.PgError
		if errors.As(res.Error, &pgErr) && pgErr.Code == "23503" {
			c.JSON(http.StatusConflict, gin.H{"error": "Region cannot be deleted because it is referenced by countries or destinations"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete region"})
		return
	}
	if res.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Region not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Region deleted successfully"})
}
