package repository

import (
	"context"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// VisaRequirementRepository defines the contract for visa data access.
type VisaRequirementRepository interface {
	GetByCountryPair(ctx context.Context, sourceID uuid.UUID, destinationID uuid.UUID) (*models.VisaRequirement, error)
}

// GormVisaRequirementRepository is the GORM-based implementation.
type GormVisaRequirementRepository struct {
	db *gorm.DB
}

func NewGormVisaRequirementRepository(db *gorm.DB) *GormVisaRequirementRepository {
	return &GormVisaRequirementRepository{db: db}
}

// GetByCountryPair retrieves the visa requirement for a specific source → destination country pair.
func (r *GormVisaRequirementRepository) GetByCountryPair(ctx context.Context, sourceID uuid.UUID, destinationID uuid.UUID) (*models.VisaRequirement, error) {
	var visa models.VisaRequirement
	err := r.db.WithContext(ctx).
		Where("source_country_id = ? AND destination_country_id = ?", sourceID, destinationID).
		First(&visa).Error
	if err != nil {
		return nil, err
	}
	return &visa, nil
}
