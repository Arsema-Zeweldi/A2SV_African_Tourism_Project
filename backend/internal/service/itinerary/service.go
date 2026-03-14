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
	AddItem(ctx context.Context, itineraryID uuid.UUID, item *models.ItineraryItem) error
	UpdateItem(ctx context.Context, itineraryID uuid.UUID, item *models.ItineraryItem) error
}
