package region

import (
	"context"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/google/uuid"
)

// RegionService defines region operations.
type RegionService interface {
	List(ctx context.Context) ([]models.Region, error)
	GetByID(ctx context.Context, id uuid.UUID) (*models.Region, error)
	Create(ctx context.Context, region *models.Region) error
	Update(ctx context.Context, id uuid.UUID, updates map[string]interface{}) error
	Delete(ctx context.Context, id uuid.UUID) error
}
