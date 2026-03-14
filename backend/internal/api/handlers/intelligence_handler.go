package handlers

import (
	"net/http"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/repository"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (h *AppHandler) GetVisaRequirements(c *gin.Context) {
	var query VisaRequirementQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid visa query parameters: " + err.Error()})
		return
	}

	if h.VisaService == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Visa service not configured"})
		return
	}

	sourceID, err := uuid.Parse(query.SourceCountryID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid source_country_id UUID"})
		return
	}

	destID, err := uuid.Parse(query.DestinationCountryID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid destination_country_id UUID"})
		return
	}

	visa, err := h.VisaService.GetVisaRequirement(c.Request.Context(), sourceID, destID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Visa requirement not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": visa,
	})
}

func (h *AppHandler) GetSafetyAlerts(c *gin.Context) {
	var query SafetyAlertQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid safety query parameters: " + err.Error()})
		return
	}

	if h.SafetyService == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Safety service not configured"})
		return
	}

	filters := repository.SafetyAlertFilters{
		MinLevel: query.MinLevel,
		MaxLevel: query.MaxLevel,
	}

	if query.CountryID != "" {
		if uid, err := uuid.Parse(query.CountryID); err == nil {
			filters.CountryID = &uid
		}
	}
	
	if query.ActiveOnly != nil {
		filters.ActiveOnly = *query.ActiveOnly
	} else {
		filters.ActiveOnly = true // Default to active alerts only
	}

	filters.Pagination = repository.Pagination{
		Page:     1, // We could pull this from a full FeedQuery embedded struct but hardcode for now
		PageSize: 50,
	}

	alerts, total, err := h.SafetyService.ListSafetyAlerts(c.Request.Context(), filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to list safety alerts: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  alerts,
		"total": total,
	})
}
