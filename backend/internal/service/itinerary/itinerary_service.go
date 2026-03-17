package itinerary

import (
	"context"
	"errors"
	"strings"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/repository"
	"github.com/google/uuid"
)

// Service is a placeholder implementation of ItineraryService.
type Service struct {
	repo repository.ItineraryRepository
}

func NewService(repo repository.ItineraryRepository) *Service {
	return &Service{repo: repo}
}

func (s *Service) Save(ctx context.Context, itinerary *models.Itinerary) error {
	if itinerary == nil {
		return errors.New("itinerary is nil")
	}
	if itinerary.UserID == uuid.Nil {
		return errors.New("user_id is required")
	}
	itinerary.Title = strings.TrimSpace(itinerary.Title)
	if itinerary.Title == "" {
		return errors.New("title is required")
	}
	itinerary.Description = strings.TrimSpace(itinerary.Description)
	for i := range itinerary.Items {
		if err := validateItem(&itinerary.Items[i]); err != nil {
			return err
		}
	}
	return s.repo.Create(ctx, itinerary)
}

func (s *Service) GetByID(ctx context.Context, id uuid.UUID) (*models.Itinerary, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *Service) ListByUserID(ctx context.Context, userID uuid.UUID) ([]models.Itinerary, error) {
	if userID == uuid.Nil {
		return nil, errors.New("user_id is required")
	}
	return s.repo.ListByUserID(ctx, userID)
}

func (s *Service) AddItem(ctx context.Context, itineraryID uuid.UUID, item *models.ItineraryItem) error {
	if item == nil {
		return errors.New("item is nil")
	}
	if itineraryID == uuid.Nil {
		return errors.New("itinerary_id is required")
	}
	if err := validateItem(item); err != nil {
		return err
	}
	return s.repo.AddItem(ctx, itineraryID, item)
}

func (s *Service) UpdateItem(ctx context.Context, itineraryID uuid.UUID, itemID uuid.UUID, updates map[string]interface{}) error {
	if itineraryID == uuid.Nil {
		return errors.New("itinerary_id is required")
	}
	if itemID == uuid.Nil {
		return errors.New("item_id is required")
	}
	if len(updates) == 0 {
		return errors.New("no updates provided")
	}
	trimUpdateStrings(updates, []string{"title", "description", "time_label", "duration_label", "cost_label", "location", "activity_type", "image_url", "requirement", "start_time", "end_time"})
	if title, ok := updates["title"].(string); ok && strings.TrimSpace(title) == "" {
		return errors.New("title cannot be empty")
	}
	if dayNumber, ok := updates["day_number"].(int); ok && dayNumber <= 0 {
		return errors.New("day_number must be greater than 0")
	}
	if activityType, ok := updates["activity_type"].(string); ok && activityType != "" && !isValidActivityType(activityType) {
		return errors.New("activity_type is invalid")
	}
	return s.repo.UpdateItem(ctx, itineraryID, itemID, updates)
}

func (s *Service) Delete(ctx context.Context, id uuid.UUID) error {
	if id == uuid.Nil {
		return errors.New("id is required")
	}
	return s.repo.Delete(ctx, id)
}

func (s *Service) DeleteItem(ctx context.Context, itineraryID uuid.UUID, itemID uuid.UUID) error {
	if itineraryID == uuid.Nil {
		return errors.New("itinerary_id is required")
	}
	if itemID == uuid.Nil {
		return errors.New("item_id is required")
	}
	return s.repo.DeleteItem(ctx, itineraryID, itemID)
}

func validateItem(item *models.ItineraryItem) error {
	item.Title = strings.TrimSpace(item.Title)
	item.Description = strings.TrimSpace(item.Description)
	item.TimeLabel = strings.TrimSpace(item.TimeLabel)
	item.DurationLabel = strings.TrimSpace(item.DurationLabel)
	item.CostLabel = strings.TrimSpace(item.CostLabel)
	item.Location = strings.TrimSpace(item.Location)
	item.ActivityType = strings.TrimSpace(item.ActivityType)
	item.ImageURL = strings.TrimSpace(item.ImageURL)
	item.Requirement = strings.TrimSpace(item.Requirement)
	item.StartTime = strings.TrimSpace(item.StartTime)
	item.EndTime = strings.TrimSpace(item.EndTime)
	if item.DayNumber <= 0 {
		return errors.New("day_number must be greater than 0")
	}
	if item.Title == "" {
		return errors.New("title is required")
	}
	if item.ActivityType != "" && !isValidActivityType(item.ActivityType) {
		return errors.New("activity_type is invalid")
	}
	return nil
}

func trimUpdateStrings(updates map[string]interface{}, keys []string) {
	for _, key := range keys {
		if value, ok := updates[key]; ok {
			if str, ok := value.(string); ok {
				updates[key] = strings.TrimSpace(str)
			}
		}
	}
}

func isValidActivityType(value string) bool {
	switch value {
	case models.ActivityFood, models.ActivityAdventure, models.ActivityCulture, models.ActivityParty, models.ActivityWildlife:
		return true
	default:
		return false
	}
}
