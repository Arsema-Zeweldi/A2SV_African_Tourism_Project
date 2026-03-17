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
	if h.UserService == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User service not configured"})
		return
	}

	prefs, err := h.UserService.GetPreferences(c.Request.Context(), userIdStr.(string))
	if err != nil {
		if err == gorm.ErrRecordNotFound {
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

	if h.UserService == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User service not configured"})
		return
	}

	updates := map[string]interface{}{}

	if req.PreferredSeason != nil {
		updates["preferred_season"] = *req.PreferredSeason
	}
	if req.BudgetRange != nil {
		updates["budget_range"] = *req.BudgetRange
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
	if req.PreferredClimate != nil {
		updates["preferred_climate"] = *req.PreferredClimate
	}
	if req.PreferredLanguage != nil {
		updates["preferred_language"] = *req.PreferredLanguage
	}
	if req.TravelVibeInterest != nil {
		updates["travel_vibe_interest"] = *req.TravelVibeInterest
	}
	if req.TravelVibes != nil && len(*req.TravelVibes) > 0 {
		updates["travel_vibe_interest"] = (*req.TravelVibes)[0]
	}

	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No fields provided to update"})
		return
	}

	userID := uuid.MustParse(userIdStr.(string))
	updated, err := h.UserService.UpdatePreferences(c.Request.Context(), userID.String(), updates)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update preferences"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Preferences updated", "data": updated})
}

func (h *AppHandler) GetProfile(c *gin.Context) {
	userIdStr, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	if h.UserService == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User service not configured"})
		return
	}

	user, err := h.UserService.GetProfile(c.Request.Context(), userIdStr.(string))
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch profile"})
		return
	}

	resp := UserProfileResponse{
		UserID:          user.UserID,
		Email:           user.Email,
		FirstName:       user.FirstName,
		LastName:        user.LastName,
		Country:         user.Country,
		Bio:             user.Bio,
		ProfileImageURL: user.ProfileImageURL,
		CreatedAt:       user.CreatedAt.Format("2006-01-02T15:04:05Z"),
	}

	c.JSON(http.StatusOK, gin.H{"data": resp})
}

func (h *AppHandler) UpdateProfile(c *gin.Context) {
	userIdStr, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var req UpdateProfileRequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ID: 10 - Handle optional avatar upload
	imageUrl := ""
	file, err := c.FormFile("avatar")
	if err == nil {
		f, err := file.Open()
		if err == nil {
			defer f.Close()
			if h.UploadSvc != nil {
				url, err := h.UploadSvc.UploadImage(c.Request.Context(), f, "profiles")
				if err == nil {
					imageUrl = url
				}
			}
		}
	}

	if h.UserService == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User service not configured"})
		return
	}

	updates := map[string]interface{}{}
	if req.FirstName != nil {
		updates["first_name"] = *req.FirstName
	}
	if req.LastName != nil {
		updates["last_name"] = *req.LastName
	}
	if req.Country != nil {
		updates["country"] = *req.Country
	}
	if req.Bio != nil {
		updates["bio"] = *req.Bio
	}
	if req.ProfileImageURL != nil {
		updates["profile_image_url"] = *req.ProfileImageURL
	}
	if imageUrl != "" {
		updates["profile_image_url"] = imageUrl
	}

	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No fields to update"})
		return
	}

	user, err := h.UserService.UpdateProfile(c.Request.Context(), userIdStr.(string), updates)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	resp := UserProfileResponse{
		UserID:          user.UserID,
		Email:           user.Email,
		FirstName:       user.FirstName,
		LastName:        user.LastName,
		Country:         user.Country,
		Bio:             user.Bio,
		ProfileImageURL: user.ProfileImageURL,
		CreatedAt:       user.CreatedAt.Format("2006-01-02T15:04:05Z"),
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profile updated", "data": resp})
}
