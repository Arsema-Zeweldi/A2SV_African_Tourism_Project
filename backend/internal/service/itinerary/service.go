package itinerary

import (
	"context"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/google/uuid"
)

// ItineraryService defines itinerary operations.
type ItineraryService interface {
	Save(ctx context.Context, itinerary *models.Itinerary) error
	GetByID(ctx context.Context, id uuid.UUID) (*models.Itinerary, error)
	ListByUserID(ctx context.Context, userID uuid.UUID) ([]models.Itinerary, error)
	AddActivity(ctx context.Context, itineraryID uuid.UUID, activity *models.ItineraryActivity) error
	UpdateActivity(ctx context.Context, itineraryID uuid.UUID, activityID uuid.UUID, updates map[string]interface{}) error
	Delete(ctx context.Context, id uuid.UUID) error
	DeleteActivity(ctx context.Context, itineraryID uuid.UUID, activityID uuid.UUID) error
}
