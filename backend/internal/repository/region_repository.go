package repository

import (
	"context"
	"errors"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// RegionRepository defines the contract for region data access.
type RegionRepository interface {
	List(ctx context.Context) ([]models.Region, error)
	Create(ctx context.Context, region *models.Region) error
	GetByID(ctx context.Context, id uuid.UUID) (*models.Region, error)
	Update(ctx context.Context, id uuid.UUID, updates map[string]interface{}) error
	Delete(ctx context.Context, id uuid.UUID) error
}

// GormRegionRepository is the GORM-based implementation.
type GormRegionRepository struct {
	db *gorm.DB
}

func NewGormRegionRepository(db *gorm.DB) *GormRegionRepository {
	return &GormRegionRepository{db: db}
}

func (r *GormRegionRepository) List(ctx context.Context) ([]models.Region, error) {
	var regions []models.Region
	err := r.db.WithContext(ctx).Order("name ASC").Find(&regions).Error
	return regions, err
}

func (r *GormRegionRepository) Create(ctx context.Context, region *models.Region) error {
	return r.db.WithContext(ctx).Create(region).Error
}

func (r *GormRegionRepository) GetByID(ctx context.Context, id uuid.UUID) (*models.Region, error) {
	var region models.Region
	err := r.db.WithContext(ctx).First(&region, "region_id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &region, nil
}

func (r *GormRegionRepository) Update(ctx context.Context, id uuid.UUID, updates map[string]interface{}) error {
	res := r.db.WithContext(ctx).Model(&models.Region{}).Where("region_id = ?", id).Updates(updates)
	if res.Error != nil {
		return res.Error
	}
	if res.RowsAffected == 0 {
		return errors.New("region not found")
	}
	return nil
}

func (r *GormRegionRepository) Delete(ctx context.Context, id uuid.UUID) error {
	res := r.db.WithContext(ctx).Delete(&models.Region{}, "region_id = ?", id)
	if res.Error != nil {
		return res.Error
	}
	if res.RowsAffected == 0 {
		return errors.New("region not found")
	}
	return nil
}
