package repository

import (
	"context"
	"strings"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// DestinationSearchFilters holds all query parameters for destination search.
type DestinationSearchFilters struct {
	Query      string
	RegionID   *uuid.UUID
	CountryID  *uuid.UUID
	PriceLevel *int
	Season     string
	Tags       []string
	Pagination Pagination
	Sort       Sort
}

// DestinationRepository defines the contract for destination data access.
type DestinationRepository interface {
	Search(ctx context.Context, filters DestinationSearchFilters) ([]models.Destination, int64, error)
	GetByID(ctx context.Context, id uuid.UUID) (*models.Destination, error)
}

// GormDestinationRepository is the GORM-based implementation.
type GormDestinationRepository struct {
	db *gorm.DB
}

func NewGormDestinationRepository(db *gorm.DB) *GormDestinationRepository {
	return &GormDestinationRepository{db: db}
}

// Search filters destinations by the given criteria, loads tags, and paginates.
func (r *GormDestinationRepository) Search(ctx context.Context, filters DestinationSearchFilters) ([]models.Destination, int64, error) {
	q := r.db.WithContext(ctx).Model(&models.Destination{}).
		Where("is_active = true").
		Preload("Tags").
		Preload("Country")

	if strings.TrimSpace(filters.Query) != "" {
		like := "%" + filters.Query + "%"
		q = q.Where("name ILIKE ? OR short_description ILIKE ? OR city ILIKE ?", like, like, like)
	}
	if filters.CountryID != nil {
		q = q.Where("country_id = ?", *filters.CountryID)
	}
	if filters.RegionID != nil {
		q = q.Where("region_id = ?", *filters.RegionID)
	}
	if filters.PriceLevel != nil {
		q = q.Where("price_level <= ?", *filters.PriceLevel)
	}
	if filters.Season != "" {
		q = q.Where("best_season = ? OR best_season = 'year_round'", filters.Season)
	}
	if len(filters.Tags) > 0 {
		q = q.Joins("JOIN destination_tags dt ON dt.destination_id = destinations.destination_id").
			Joins("JOIN tags t ON t.tag_id = dt.tag_id").
			Where("t.slug IN ?", filters.Tags)
	}

	var total int64
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Sorting
	orderField := "average_rating"
	orderDir := "DESC"
	if filters.Sort.Field != "" {
		allowed := map[string]string{
			"average_rating": "average_rating",
			"name":           "name",
			"price_level":    "price_level",
			"total_reviews":  "total_reviews",
		}
		if col, ok := allowed[filters.Sort.Field]; ok {
			orderField = col
		}
	}
	if strings.ToUpper(filters.Sort.Order) == "ASC" {
		orderDir = "ASC"
	}

	page := filters.Pagination.Page
	if page <= 0 {
		page = 1
	}
	pageSize := filters.Pagination.PageSize
	if pageSize <= 0 || pageSize > 100 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	var destinations []models.Destination
	if err := q.Order(orderField + " " + orderDir).
		Limit(pageSize).
		Offset(offset).
		Find(&destinations).Error; err != nil {
		return nil, 0, err
	}

	return destinations, total, nil
}

// GetByID fetches a single destination with its tags and country preloaded.
func (r *GormDestinationRepository) GetByID(ctx context.Context, id uuid.UUID) (*models.Destination, error) {
	var dest models.Destination
	err := r.db.WithContext(ctx).
		Preload("Tags").
		Preload("Country").
		Preload("Country.Region").
		First(&dest, "destination_id = ? AND is_active = true", id).Error
	if err != nil {
		return nil, err
	}
	return &dest, nil
}
