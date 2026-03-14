package itinerary

import (
	"context"

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
	return repository.ErrNotImplemented
}

func (s *Service) GetByID(ctx context.Context, id uuid.UUID) (*models.Itinerary, error) {
	return nil, repository.ErrNotImplemented
}

func (s *Service) AddItem(ctx context.Context, itineraryID uuid.UUID, item *models.ItineraryItem) error {
	return repository.ErrNotImplemented
}

func (s *Service) UpdateItem(ctx context.Context, itineraryID uuid.UUID, item *models.ItineraryItem) error {
	return repository.ErrNotImplemented
}
