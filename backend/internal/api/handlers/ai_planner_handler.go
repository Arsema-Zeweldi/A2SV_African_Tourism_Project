package handlers

import (
	"encoding/json"
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
		GroupSize:    req.GroupSize,
		MultiCountry: boolFromPtr(req.MultiCountry),
		Notes:        req.Notes,
	}

	// Make AI planner aware of user preferences if available
	userID, err := getUserID(c)
	if err == nil && h.UserService != nil {
		prefs, prefErr := h.UserService.GetPreferences(c.Request.Context(), userID.String())
		if prefErr == nil {
			// Inject preferences if user didn't explicitly specify them in this request
			if req.BudgetLevel == "" && planReq.BudgetLevel == "" && prefs.BudgetRange != nil && *prefs.BudgetRange != "" {
				planReq.BudgetLevel = *prefs.BudgetRange
			}
			if len(req.VibeTags) == 0 && prefs.TravelVibeInterest != nil && *prefs.TravelVibeInterest != "" {
				planReq.VibeTags = []string{*prefs.TravelVibeInterest}
			} else {
				planReq.VibeTags = req.VibeTags
			}
			if req.ClimatePref == "" && prefs.PreferredClimate != nil && *prefs.PreferredClimate != "" {
				planReq.ClimatePref = *prefs.PreferredClimate
			} else {
				planReq.ClimatePref = req.ClimatePref
			}
			
			// Append dietary restrictions / languages to notes
			if len(prefs.DietaryRestrictions) > 0 || (prefs.PreferredLanguage != nil && *prefs.PreferredLanguage != "") {
				var extraNotes strings.Builder
				if len(prefs.DietaryRestrictions) > 0 {
					var rawList []string
					if err := json.Unmarshal(prefs.DietaryRestrictions, &rawList); err == nil && len(rawList) > 0 {
						extraNotes.WriteString("Dietary Restrictions: " + strings.Join(rawList, ", ") + ". ")
					}
				}
				if prefs.PreferredLanguage != nil && *prefs.PreferredLanguage != "" {
					extraNotes.WriteString("Preferred Language: " + *prefs.PreferredLanguage + ". ")
				}
				if extraNotes.Len() > 0 {
					planReq.Notes = planReq.Notes + " [User Preferences: " + extraNotes.String() + "]"
				}
			}
		} else {
			planReq.VibeTags = req.VibeTags
			planReq.ClimatePref = req.ClimatePref
		}
	} else {
		planReq.VibeTags = req.VibeTags
		planReq.ClimatePref = req.ClimatePref
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

// ChatAboutActivity answers a user question about a specific itinerary activity using AI.
func (h *AppHandler) ChatAboutActivity(c *gin.Context) {
	if h.PlannerService == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "AI planner service not configured"})
		return
	}

	var req ActivityChatRequestDTO
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	chatReq := ai_planner.ActivityChatRequest{
		ActivityTitle:       req.ActivityTitle,
		ActivityDescription: req.ActivityDescription,
		ActivityLocation:    req.ActivityLocation,
		Question:            req.Question,
	}

	result, err := h.PlannerService.ChatAboutActivity(c.Request.Context(), chatReq)
	if err != nil {
		if strings.Contains(err.Error(), "quota") || strings.Contains(err.Error(), "rate limit") {
			c.JSON(http.StatusTooManyRequests, gin.H{"error": "AI service rate limit exceeded. Please try again later."})
			return
		}
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "AI chat failed: " + err.Error()})
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
