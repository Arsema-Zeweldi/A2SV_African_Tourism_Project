package repository

import (
	"context"
	"errors"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// ItineraryRepository defines the contract for itinerary data access.
type ItineraryRepository interface {
	Create(ctx context.Context, itinerary *models.Itinerary) error
	GetByID(ctx context.Context, id uuid.UUID) (*models.Itinerary, error)
	ListByUserID(ctx context.Context, userID uuid.UUID) ([]models.Itinerary, error)
	AddItem(ctx context.Context, itineraryID uuid.UUID, item *models.ItineraryItem) error
	UpdateItem(ctx context.Context, itineraryID uuid.UUID, itemID uuid.UUID, updates map[string]interface{}) error
	Delete(ctx context.Context, id uuid.UUID) error
	DeleteItem(ctx context.Context, itineraryID uuid.UUID, itemID uuid.UUID) error
}

// GormItineraryRepository is the GORM-based implementation.
type GormItineraryRepository struct {
	db *gorm.DB
}

func NewGormItineraryRepository(db *gorm.DB) *GormItineraryRepository {
	return &GormItineraryRepository{db: db}
}

// Create persists a new itinerary and all its items in a single transaction.
func (r *GormItineraryRepository) Create(ctx context.Context, itinerary *models.Itinerary) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(itinerary).Error; err != nil {
			return err
		}
		for i := range itinerary.Items {
			itinerary.Items[i].ItineraryID = itinerary.ItineraryID
		}
		if len(itinerary.Items) > 0 {
			return tx.Create(&itinerary.Items).Error
		}
		return nil
	})
}

// GetByID fetches an itinerary with all items preloaded.
func (r *GormItineraryRepository) GetByID(ctx context.Context, id uuid.UUID) (*models.Itinerary, error) {
	var it models.Itinerary
	err := r.db.WithContext(ctx).
		Preload("Items", func(db *gorm.DB) *gorm.DB {
			return db.Order("day_number ASC, order_index ASC")
		}).
		First(&it, "itinerary_id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &it, nil
}

func (r *GormItineraryRepository) ListByUserID(ctx context.Context, userID uuid.UUID) ([]models.Itinerary, error) {
	var itineraries []models.Itinerary
	err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&itineraries).Error
	return itineraries, err
}

// AddItem persists a new item under the given itinerary.
func (r *GormItineraryRepository) AddItem(ctx context.Context, itineraryID uuid.UUID, item *models.ItineraryItem) error {
	item.ItineraryID = itineraryID
	return r.db.WithContext(ctx).Create(item).Error
}

// UpdateItem updates a specific itinerary item, ensuring it belongs to the given itinerary.
func (r *GormItineraryRepository) UpdateItem(ctx context.Context, itineraryID uuid.UUID, itemID uuid.UUID, updates map[string]interface{}) error {
	res := r.db.WithContext(ctx).
		Model(&models.ItineraryItem{}).
		Where("item_id = ? AND itinerary_id = ?", itemID, itineraryID).
		Updates(updates)
	if res.Error != nil {
		return res.Error
	}
	if res.RowsAffected == 0 {
		return errors.New("item not found")
	}
	return nil
}

func (r *GormItineraryRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("itinerary_id = ?", id).Delete(&models.ItineraryItem{}).Error; err != nil {
			return err
		}
		return tx.Delete(&models.Itinerary{}, "itinerary_id = ?", id).Error
	})
}

func (r *GormItineraryRepository) DeleteItem(ctx context.Context, itineraryID uuid.UUID, itemID uuid.UUID) error {
	res := r.db.WithContext(ctx).
		Where("item_id = ? AND itinerary_id = ?", itemID, itineraryID).
		Delete(&models.ItineraryItem{})
	if res.Error != nil {
		return res.Error
	}
	if res.RowsAffected == 0 {
		return errors.New("item not found")
	}
	return nil
}
