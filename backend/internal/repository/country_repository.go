package repository

import (
	"context"
	"strings"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// CountryRepository defines the contract for country data access.
type CountryRepository interface {
	List(ctx context.Context, params Pagination, query string, isoCode string) ([]models.Country, int64, error)
	GetByID(ctx context.Context, id uuid.UUID) (*models.Country, error)
	Create(ctx context.Context, country *models.Country) error
	Update(ctx context.Context, id uuid.UUID, updates map[string]interface{}) error
	Delete(ctx context.Context, id uuid.UUID) error
}

// GormCountryRepository is the GORM-based implementation.
type GormCountryRepository struct {
	db *gorm.DB
}

func NewGormCountryRepository(db *gorm.DB) *GormCountryRepository {
	return &GormCountryRepository{db: db}
}

func (r *GormCountryRepository) List(ctx context.Context, params Pagination, query string, isoCode string) ([]models.Country, int64, error) {
	q := r.db.WithContext(ctx).Model(&models.Country{})

	if strings.TrimSpace(query) != "" {
		like := "%" + strings.TrimSpace(query) + "%"
		q = q.Where("name ILIKE ? OR capital ILIKE ?", like, like)
	}
	if strings.TrimSpace(isoCode) != "" {
		q = q.Where("iso_code = ?", strings.ToUpper(strings.TrimSpace(isoCode)))
	}

	var total int64
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	page, pageSize := normalizePagination(params)
	offset := (page - 1) * pageSize

	var countries []models.Country
	if err := q.Order("name ASC").
		Limit(pageSize).
		Offset(offset).
		Find(&countries).Error; err != nil {
		return nil, 0, err
	}

	return countries, total, nil
}

func (r *GormCountryRepository) GetByID(ctx context.Context, id uuid.UUID) (*models.Country, error) {
	var country models.Country
	if err := r.db.WithContext(ctx).
		First(&country, "country_id = ?", id).Error; err != nil {
		return nil, err
	}
	return &country, nil
}

func (r *GormCountryRepository) Create(ctx context.Context, country *models.Country) error {
	if strings.TrimSpace(country.ISOCode) != "" {
		country.ISOCode = strings.ToUpper(strings.TrimSpace(country.ISOCode))
	}
	return r.db.WithContext(ctx).Create(country).Error
}

func (r *GormCountryRepository) Update(ctx context.Context, id uuid.UUID, updates map[string]interface{}) error {
	if raw, ok := updates["iso_code"]; ok {
		if iso, ok := raw.(string); ok {
			updates["iso_code"] = strings.ToUpper(strings.TrimSpace(iso))
		}
	}
	return r.db.WithContext(ctx).
		Model(&models.Country{}).
		Where("country_id = ?", id).
		Updates(updates).Error
}

func (r *GormCountryRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&models.Country{}, "country_id = ?", id).Error
}
