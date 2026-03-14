package intelligence

import (
	"context"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/repository"
)

// SafetyService handles safety alert lookups.
type SafetyService interface {
	ListSafetyAlerts(ctx context.Context, filters repository.SafetyAlertFilters) ([]models.SafetyAlert, int64, error)
}

// DefaultSafetyService is the concrete implementation.
type DefaultSafetyService struct {
	repo repository.SafetyAlertRepository
}

func NewSafetyService(repo repository.SafetyAlertRepository) *DefaultSafetyService {
	return &DefaultSafetyService{repo: repo}
}

func (s *DefaultSafetyService) ListSafetyAlerts(ctx context.Context, filters repository.SafetyAlertFilters) ([]models.SafetyAlert, int64, error) {
	return s.repo.List(ctx, filters)
}
