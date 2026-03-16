package repository

import (
	"context"
	"time"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// SafetyAlertFilters holds filter criteria for safety alert queries.
type SafetyAlertFilters struct {
	CountryID  *uuid.UUID
	MinLevel   *int
	MaxLevel   *int
	ActiveOnly bool
	Pagination Pagination
	Sort       Sort
}

// SafetyAlertRepository defines the contract for safety alert data access.
type SafetyAlertRepository interface {
	List(ctx context.Context, filters SafetyAlertFilters) ([]models.SafetyAlert, int64, error)
}

// GormSafetyAlertRepository is the GORM-based implementation.
type GormSafetyAlertRepository struct {
	db *gorm.DB
}

func NewGormSafetyAlertRepository(db *gorm.DB) *GormSafetyAlertRepository {
	return &GormSafetyAlertRepository{db: db}
}

// List returns safety alerts filtered by country, level, and active status.
func (r *GormSafetyAlertRepository) List(ctx context.Context, filters SafetyAlertFilters) ([]models.SafetyAlert, int64, error) {
	q := r.db.WithContext(ctx).Model(&models.SafetyAlert{})

	if filters.CountryID != nil {
		q = q.Where("country_id = ?", *filters.CountryID)
	}
	if filters.MinLevel != nil {
		q = q.Where("level >= ?", *filters.MinLevel)
	}
	if filters.MaxLevel != nil {
		q = q.Where("level <= ?", *filters.MaxLevel)
	}
	if filters.ActiveOnly {
		now := time.Now()
		q = q.Where("valid_until IS NULL OR valid_until > ?", now)
	}

	var total int64
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	page := filters.Pagination.Page
	if page <= 0 {
		page = 1
	}
	pageSize := filters.Pagination.PageSize
	if pageSize <= 0 || pageSize > 100 {
		pageSize = 20
	}

	var alerts []models.SafetyAlert
	if err := q.Order("level DESC, created_at DESC").
		Limit(pageSize).
		Offset((page - 1) * pageSize).
		Find(&alerts).Error; err != nil {
		return nil, 0, err
	}

	return alerts, total, nil
}
