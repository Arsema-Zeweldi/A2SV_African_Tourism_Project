package region

import (
	"context"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/repository"
	"github.com/google/uuid"
)

// Service is a placeholder implementation of RegionService.
type Service struct {
	repo repository.RegionRepository
}

func NewService(repo repository.RegionRepository) *Service {
	return &Service{repo: repo}
}

func (s *Service) List(ctx context.Context) ([]models.Region, error) {
	return nil, repository.ErrNotImplemented
}

func (s *Service) GetByID(ctx context.Context, id uuid.UUID) (*models.Region, error) {
	return nil, repository.ErrNotImplemented
}

func (s *Service) Create(ctx context.Context, region *models.Region) error {
	return repository.ErrNotImplemented
}

func (s *Service) Update(ctx context.Context, id uuid.UUID, updates map[string]interface{}) error {
	return repository.ErrNotImplemented
}

func (s *Service) Delete(ctx context.Context, id uuid.UUID) error {
	return repository.ErrNotImplemented
}
