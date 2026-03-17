package handlers

import (
	"net/http"
	"strings"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/service/ai_planner"
	"github.com/gin-gonic/gin"
)

// GenerateItinerary creates a new itinerary using the AI planner service.
func (h *AppHandler) GenerateItinerary(c *gin.Context) {
	if h.PlannerService == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "AI planner service not configured"})
		return
	}

	var req GeneratePlanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	planReq := ai_planner.GenerateRequest{
		Destination:  req.Destination,
		DurationDays: req.DurationDays,
		Budget:       req.Budget,
		BudgetLevel:  resolveBudgetLevel(req.BudgetLevel, req.Budget),
		VibeTags:     req.VibeTags,
		GroupSize:    req.GroupSize,
		ClimatePref:  req.ClimatePref,
		MultiCountry: boolFromPtr(req.MultiCountry),
		Notes:        req.Notes,
	}

	result, err := h.PlannerService.GenerateItinerary(c.Request.Context(), planReq)
	if err != nil {
		// Differentiate between user errors/rate limits and internal errors if possible.
		// For now, mapping broadly. 
		if strings.Contains(err.Error(), "quota") || strings.Contains(err.Error(), "rate limit") {
			c.JSON(http.StatusTooManyRequests, gin.H{"error": "AI service rate limit exceeded. Please try again later."})
			return
		}
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "AI generation failed: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}

// resolveBudgetLevel maps string labels or numeric budget to standard levels.
func resolveBudgetLevel(level string, budget float64) string {
	if level != "" {
		return level
	}
	if budget <= 0 {
		return ""
	}
	if budget < 1000 {
		return "low"
	}
	if budget < 5000 {
		return "medium"
	}
	return "luxury"
}
