package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (h *AppHandler) GetUserPreferences(c *gin.Context) {
	userIdStr, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var prefs models.UserPreference
	if err := h.DB.Where("user_id = ?", userIdStr).First(&prefs).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			// Return empty preferences instead of 404
			c.JSON(http.StatusOK, gin.H{"data": models.UserPreference{}})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch preferences"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": prefs})
}

func (h *AppHandler) UpdateUserPreferences(c *gin.Context) {
	userIdStr, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var req UpdateUserPreferencesRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := uuid.MustParse(userIdStr.(string))
	updates := map[string]interface{}{}

	if req.TravelerType != nil {
		updates["traveler_type"] = *req.TravelerType
	}
	if req.PreferredSeason != nil {
		updates["preferred_season"] = *req.PreferredSeason
	}
	if req.BudgetRange != nil {
		updates["budget_range"] = *req.BudgetRange
	}
	if req.TripDuration != nil {
		updates["trip_duration"] = *req.TripDuration
	}
	if req.PreferredActivities != nil {
		payload, err := json.Marshal(req.PreferredActivities)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid preferred_activities"})
			return
		}
		updates["preferred_activities"] = payload
	}
	if req.DietaryRestrictions != nil {
		payload, err := json.Marshal(req.DietaryRestrictions)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid dietary_restrictions"})
			return
		}
		updates["dietary_restrictions"] = payload
	}
	if req.AccessibilityNeeds != nil {
		payload, err := json.Marshal(req.AccessibilityNeeds)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid accessibility_needs"})
			return
		}
		updates["accessibility_needs"] = payload
	}

	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No fields provided to update"})
		return
	}

	res := h.DB.Model(&models.UserPreference{}).Where("user_id = ?", userID).Updates(updates)
	if res.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update preferences"})
		return
	}

	if res.RowsAffected == 0 {
		prefs := models.UserPreference{UserID: userID}
		if err := h.DB.Create(&prefs).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create preferences"})
			return
		}
		if err := h.DB.Model(&prefs).Where("user_id = ?", userID).Updates(updates).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update preferences"})
			return
		}
	}

	var prefs models.UserPreference
	if err := h.DB.Where("user_id = ?", userID).First(&prefs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load updated preferences"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Preferences updated", "data": prefs})
}
