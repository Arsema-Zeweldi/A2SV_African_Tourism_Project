package handlers

import (
	"net/http"
	"strings"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (h *AppHandler) SaveItinerary(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	if h.ItinerarySvc == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Itinerary service not configured"})
		return
	}

	var req CreateItineraryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	startDate, err := parseISODate(req.StartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start_date format (YYYY-MM-DD expected)"})
		return
	}
	endDate, err := parseISODate(req.EndDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end_date format (YYYY-MM-DD expected)"})
		return
	}

	itinerary := models.Itinerary{
		UserID:      userID,
		Title:       strings.TrimSpace(req.Title),
		Description: strings.TrimSpace(req.Description),
		DaysCount:   req.DaysCount,
		NightsCount: req.NightsCount,
		StartDate:   startDate,
		EndDate:     endDate,
	}

	items := make([]models.ItineraryItem, 0, len(req.Items))
	for _, item := range req.Items {
		items = append(items, models.ItineraryItem{
			DayNumber:     item.DayNumber,
			OrderIndex:    item.OrderIndex,
			Title:         strings.TrimSpace(item.Title),
			Description:   strings.TrimSpace(item.Description),
			TimeLabel:     strings.TrimSpace(item.TimeLabel),
			DurationLabel: strings.TrimSpace(item.DurationLabel),
			CostLabel:     strings.TrimSpace(item.CostLabel),
			Location:      strings.TrimSpace(item.Location),
			ActivityType:  strings.TrimSpace(item.ActivityType),
			ImageURL:      strings.TrimSpace(item.ImageURL),
			AIPick:        item.AIPick,
			Requirement:   strings.TrimSpace(item.Requirement),
			Latitude:      item.Latitude,
			Longitude:     item.Longitude,
			StartTime:     strings.TrimSpace(item.StartTime),
			EndTime:       strings.TrimSpace(item.EndTime),
		})
	}
	itinerary.Items = items

	if err := h.ItinerarySvc.Save(c.Request.Context(), &itinerary); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create itinerary: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, itinerary)
}

func (h *AppHandler) ListUserItineraries(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	if h.ItinerarySvc == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Itinerary service not configured"})
		return
	}

	itineraries, err := h.ItinerarySvc.ListByUserID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch itineraries"})
		return
	}

	c.JSON(http.StatusOK, itineraries)
}

func (h *AppHandler) GetItinerary(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	if h.ItinerarySvc == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Itinerary service not configured"})
		return
	}

	itineraryID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid itinerary ID"})
		return
	}

	itinerary, err := h.ItinerarySvc.GetByID(c.Request.Context(), itineraryID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Itinerary not found"})
		return
	}
	if itinerary.UserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "Itinerary not found"})
		return
	}

	c.JSON(http.StatusOK, itinerary)
}

func (h *AppHandler) AddItineraryItem(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	if h.ItinerarySvc == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Itinerary service not configured"})
		return
	}

	itineraryID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid itinerary ID"})
		return
	}

	var req CreateItineraryItem
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	itinerary, err := h.ItinerarySvc.GetByID(c.Request.Context(), itineraryID)
	if err != nil || itinerary.UserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "Itinerary not found"})
		return
	}

	item := models.ItineraryItem{
		ItineraryID:   itinerary.ItineraryID,
		DayNumber:     req.DayNumber,
		OrderIndex:    req.OrderIndex,
		Title:         strings.TrimSpace(req.Title),
		Description:   strings.TrimSpace(req.Description),
		TimeLabel:     strings.TrimSpace(req.TimeLabel),
		DurationLabel: strings.TrimSpace(req.DurationLabel),
		CostLabel:     strings.TrimSpace(req.CostLabel),
		Location:      strings.TrimSpace(req.Location),
		ActivityType:  strings.TrimSpace(req.ActivityType),
		ImageURL:      strings.TrimSpace(req.ImageURL),
		AIPick:        req.AIPick,
		Requirement:   strings.TrimSpace(req.Requirement),
		Latitude:      req.Latitude,
		Longitude:     req.Longitude,
		StartTime:     strings.TrimSpace(req.StartTime),
		EndTime:       strings.TrimSpace(req.EndTime),
	}

	if err := h.ItinerarySvc.AddItem(c.Request.Context(), itineraryID, &item); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add itinerary item"})
		return
	}

	c.JSON(http.StatusCreated, item)
}

func (h *AppHandler) UpdateItineraryItem(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	if h.ItinerarySvc == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Itinerary service not configured"})
		return
	}

	itineraryID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid itinerary ID"})
		return
	}

	var req UpdateItineraryItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	itemID, err := uuid.Parse(req.ItemID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid item_id"})
		return
	}

	itinerary, err := h.ItinerarySvc.GetByID(c.Request.Context(), itineraryID)
	if err != nil || itinerary.UserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "Itinerary not found"})
		return
	}

	updates := map[string]interface{}{}
	if req.DayNumber != nil {
		updates["day_number"] = *req.DayNumber
	}
	if req.OrderIndex != nil {
		updates["order_index"] = *req.OrderIndex
	}
	if req.Title != nil {
		trimmed := strings.TrimSpace(*req.Title)
		if trimmed == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Title cannot be empty"})
			return
		}
		updates["title"] = trimmed
	}
	if req.Description != nil {
		updates["description"] = strings.TrimSpace(*req.Description)
	}
	if req.TimeLabel != nil {
		updates["time_label"] = strings.TrimSpace(*req.TimeLabel)
	}
	if req.DurationLabel != nil {
		updates["duration_label"] = strings.TrimSpace(*req.DurationLabel)
	}
	if req.CostLabel != nil {
		updates["cost_label"] = strings.TrimSpace(*req.CostLabel)
	}
	if req.Location != nil {
		updates["location"] = strings.TrimSpace(*req.Location)
	}
	if req.ActivityType != nil {
		updates["activity_type"] = strings.TrimSpace(*req.ActivityType)
	}
	if req.ImageURL != nil {
		updates["image_url"] = strings.TrimSpace(*req.ImageURL)
	}
	if req.AIPick != nil {
		updates["ai_pick"] = *req.AIPick
	}
	if req.Requirement != nil {
		updates["requirement"] = strings.TrimSpace(*req.Requirement)
	}
	if req.Latitude != nil {
		updates["latitude"] = *req.Latitude
	}
	if req.Longitude != nil {
		updates["longitude"] = *req.Longitude
	}
	if req.StartTime != nil {
		updates["start_time"] = strings.TrimSpace(*req.StartTime)
	}
	if req.EndTime != nil {
		updates["end_time"] = strings.TrimSpace(*req.EndTime)
	}

	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No fields provided to update"})
		return
	}

	if err := h.ItinerarySvc.UpdateItem(c.Request.Context(), itineraryID, itemID, updates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update itinerary item"})
		return
	}

	updated, err := h.ItinerarySvc.GetByID(c.Request.Context(), itineraryID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load updated itinerary"})
		return
	}

	for _, item := range updated.Items {
		if item.ItemID == itemID {
			c.JSON(http.StatusOK, item)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Itinerary item not found for this itinerary"})
}

func (h *AppHandler) DeleteItinerary(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	if h.ItinerarySvc == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Itinerary service not configured"})
		return
	}

	itineraryID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid itinerary ID"})
		return
	}

	itinerary, err := h.ItinerarySvc.GetByID(c.Request.Context(), itineraryID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Itinerary not found"})
		return
	}
	if itinerary.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to delete this itinerary"})
		return
	}

	if err := h.ItinerarySvc.Delete(c.Request.Context(), itineraryID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete itinerary"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Itinerary deleted successfully"})
}

func (h *AppHandler) DeleteItineraryItem(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	if h.ItinerarySvc == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Itinerary service not configured"})
		return
	}

	itineraryID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid itinerary ID"})
		return
	}

	itemID, err := uuid.Parse(c.Param("itemId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid item_id"})
		return
	}

	itinerary, err := h.ItinerarySvc.GetByID(c.Request.Context(), itineraryID)
	if err != nil || itinerary.UserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "Itinerary not found"})
		return
	}

	if err := h.ItinerarySvc.DeleteItem(c.Request.Context(), itineraryID, itemID); err != nil {
		if err.Error() == "item not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "Itinerary item not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete itinerary item"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Itinerary item deleted successfully"})
}


