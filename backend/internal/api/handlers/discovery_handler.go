package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/repository"
)

func (h *AppHandler) SearchDestinations(c *gin.Context) {
	var query DestinationSearchQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid search parameters: " + err.Error()})
		return
	}

	if h.SearchService == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Search service not configured"})
		return
	}

	filters := repository.DestinationSearchFilters{
		Query:      query.Query,
		PriceLevel: query.PriceLevel,
		Season:     query.Season,
	}

	if query.RegionID != "" {
		if uid, err := uuid.Parse(query.RegionID); err == nil {
			filters.RegionID = &uid
		}
	}
	if query.CountryID != "" {
		if uid, err := uuid.Parse(query.CountryID); err == nil {
			filters.CountryID = &uid
		}
	}
	if query.Tags != "" {
		filters.Tags = []string{query.Tags} // Serice handles comma-separated splitting
	}

	filters.Pagination = repository.Pagination{
		Page:     query.Page,
		PageSize: query.PageSize,
	}

	destinations, total, err := h.SearchService.SearchDestinations(c.Request.Context(), filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search destinations: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  destinations,
		"total": total,
		"page":  query.Page,
	})
}

func (h *AppHandler) GetDestinationDetails(c *gin.Context) {
	if h.SearchService == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Search service not configured"})
		return
	}

	id := c.Param("id")
	if _, err := uuid.Parse(id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid destination ID format"})
		return
	}

	destination, err := h.SearchService.GetDestination(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Destination not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": destination,
	})
}
