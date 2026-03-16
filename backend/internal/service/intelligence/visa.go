package intelligence

import (
	"context"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/repository"
	"github.com/google/uuid"
)

// VisaService handles visa requirement lookups.
type VisaService interface {
	GetVisaRequirement(ctx context.Context, sourceID, destinationID uuid.UUID) (*models.VisaRequirement, error)
}

// DefaultVisaService is the concrete implementation.
type DefaultVisaService struct {
	repo repository.VisaRequirementRepository
}

func NewVisaService(repo repository.VisaRequirementRepository) *DefaultVisaService {
	return &DefaultVisaService{repo: repo}
}

func (s *DefaultVisaService) GetVisaRequirement(ctx context.Context, sourceID, destinationID uuid.UUID) (*models.VisaRequirement, error) {
	return s.repo.GetByCountryPair(ctx, sourceID, destinationID)
}
