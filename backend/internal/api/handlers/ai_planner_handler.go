package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/service/ai_planner"
)

// GenerateItinerary creates a new itinerary using the AI planner service.
func (h *AppHandler) GenerateItinerary(c *gin.Context) {
	var req GeneratePlanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request parameters: " + err.Error()})
		return
	}

	if h.PlannerService == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "AI planner service not configured"})
		return
	}

	planReq := ai_planner.GenerateRequest{
		Destination:  req.Destination,
		DurationDays: req.DurationDays,
		BudgetLevel:  req.BudgetLevel,
		VibeTags:     req.VibeTags,
		GroupSize:    req.GroupSize,
		ClimatePref:  req.ClimatePref,
	}

	result, err := h.PlannerService.GenerateItinerary(c.Request.Context(), planReq)
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Itinerary generated successfully",
		"data":    result,
	})
}
