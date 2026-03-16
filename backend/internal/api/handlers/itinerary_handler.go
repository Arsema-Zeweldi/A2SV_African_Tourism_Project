package handlers

import (
	"net/http"
	"strings"
	"time"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (h *AppHandler) SaveItinerary(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var req CreateItineraryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	startDate, err := parseISODate(req.StartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start_date"})
		return
	}
	endDate, err := parseISODate(req.EndDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end_date"})
		return
	}

	itinerary := models.Itinerary{
		UserID:      userID,
		Title:       strings.TrimSpace(req.Title),
		Description: strings.TrimSpace(req.Description),
		StartDate:   startDate,
		EndDate:     endDate,
	}

	items := make([]models.ItineraryItem, 0, len(req.Items))
	for _, item := range req.Items {
		items = append(items, models.ItineraryItem{
			ItineraryID:         itinerary.ItineraryID,
			DayNumber:           item.DayNumber,
			ActivityName:        strings.TrimSpace(item.ActivityName),
			ActivityDescription: strings.TrimSpace(item.ActivityDescription),
			CostEst:             item.CostEst,
			Latitude:            item.Latitude,
			Longitude:           item.Longitude,
			StartTime:           strings.TrimSpace(item.StartTime),
			EndTime:             strings.TrimSpace(item.EndTime),
		})
		if item.DestinationID != "" {
			if destID, err := uuid.Parse(item.DestinationID); err == nil {
				items[len(items)-1].DestinationID = &destID
			} else {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid destination_id"})
				return
			}
		}
	}

	if err := h.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&itinerary).Error; err != nil {
			return err
		}
		if len(items) > 0 {
			for i := range items {
				items[i].ItineraryID = itinerary.ItineraryID
			}
			if err := tx.Create(&items).Error; err != nil {
				return err
			}
		}
		return nil
	}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create itinerary"})
		return
	}

	if err := h.DB.Preload("Items").First(&itinerary, "itinerary_id = ?", itinerary.ItineraryID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load itinerary"})
		return
	}

	c.JSON(http.StatusCreated, itinerary)
}

func (h *AppHandler) GetItinerary(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	itineraryID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid itinerary ID"})
		return
	}

	var itinerary models.Itinerary
	if err := h.DB.Preload("Items").
		First(&itinerary, "itinerary_id = ? AND user_id = ?", itineraryID, userID).
		Error; err != nil {
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

	var itinerary models.Itinerary
	if err := h.DB.First(&itinerary, "itinerary_id = ? AND user_id = ?", itineraryID, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Itinerary not found"})
		return
	}

	item := models.ItineraryItem{
		ItineraryID:         itinerary.ItineraryID,
		DayNumber:           req.DayNumber,
		ActivityName:        strings.TrimSpace(req.ActivityName),
		ActivityDescription: strings.TrimSpace(req.ActivityDescription),
		CostEst:             req.CostEst,
		Latitude:            req.Latitude,
		Longitude:           req.Longitude,
		StartTime:           strings.TrimSpace(req.StartTime),
		EndTime:             strings.TrimSpace(req.EndTime),
	}
	if req.DestinationID != "" {
		destID, err := uuid.Parse(req.DestinationID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid destination_id"})
			return
		}
		item.DestinationID = &destID
	}

	if err := h.DB.Create(&item).Error; err != nil {
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

	var itinerary models.Itinerary
	if err := h.DB.First(&itinerary, "itinerary_id = ? AND user_id = ?", itineraryID, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Itinerary not found"})
		return
	}

	updates := map[string]interface{}{}
	if req.ActivityName != nil {
		trimmed := strings.TrimSpace(*req.ActivityName)
		if trimmed == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Activity name cannot be empty"})
			return
		}
		updates["activity_name"] = trimmed
	}
	if req.ActivityDescription != nil {
		updates["activity_description"] = strings.TrimSpace(*req.ActivityDescription)
	}
	if req.CostEst != nil {
		updates["cost_est"] = *req.CostEst
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

	res := h.DB.Model(&models.ItineraryItem{}).
		Where("item_id = ? AND itinerary_id = ?", itemID, itineraryID).
		Updates(updates)
	if res.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update itinerary item"})
		return
	}
	if res.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Itinerary item not found for this itinerary", "itinerary_id": itineraryID, "item_id": itemID})
		return
	}

	var updated models.ItineraryItem
	if err := h.DB.First(&updated, "item_id = ?", itemID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load updated itinerary item"})
		return
	}

	c.JSON(http.StatusOK, updated)
}

func parseISODate(raw string) (*time.Time, error) {
	trimmed := strings.TrimSpace(raw)
	if trimmed == "" {
		return nil, nil
	}
	parsed, err := time.Parse("2006-01-02", trimmed)
	if err != nil {
		return nil, err
	}
	parsed = parsed.UTC()
	return &parsed, nil
}
