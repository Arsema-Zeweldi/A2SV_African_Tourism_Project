package repository

import (
	"context"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// UserRepository defines the contract for user data access.
type UserRepository interface {
	FindByEmail(ctx context.Context, email string) (*models.User, error)
	FindByID(ctx context.Context, id uuid.UUID) (*models.User, error)
	Update(ctx context.Context, id uuid.UUID, updates map[string]interface{}) (*models.User, error)
	Create(ctx context.Context, user *models.User) error
	GetPreferences(ctx context.Context, userID uuid.UUID) (*models.UserPreference, error)
	UpsertPreferences(ctx context.Context, userID uuid.UUID, updates map[string]interface{}) (*models.UserPreference, error)
}

// GormUserRepository is a placeholder implementation.
type GormUserRepository struct {
	db *gorm.DB
}

func NewGormUserRepository(db *gorm.DB) *GormUserRepository {
	return &GormUserRepository{db: db}
}

func (r *GormUserRepository) FindByEmail(ctx context.Context, email string) (*models.User, error) {
	var user models.User
	if err := r.db.WithContext(ctx).
		Where("email = ?", email).
		First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *GormUserRepository) FindByID(ctx context.Context, id uuid.UUID) (*models.User, error) {
	var user models.User
	if err := r.db.WithContext(ctx).
		Where("user_id = ?", id).
		First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *GormUserRepository) Update(ctx context.Context, id uuid.UUID, updates map[string]interface{}) (*models.User, error) {
	if err := r.db.WithContext(ctx).
		Model(&models.User{}).
		Where("user_id = ?", id).
		Updates(updates).Error; err != nil {
		return nil, err
	}
	return r.FindByID(ctx, id)
}

func (r *GormUserRepository) Create(ctx context.Context, user *models.User) error {
	return r.db.WithContext(ctx).Create(user).Error
}

func (r *GormUserRepository) GetPreferences(ctx context.Context, userID uuid.UUID) (*models.UserPreference, error) {
	var prefs models.UserPreference
	if err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		First(&prefs).Error; err != nil {
		return nil, err
	}
	return &prefs, nil
}

func (r *GormUserRepository) UpsertPreferences(ctx context.Context, userID uuid.UUID, updates map[string]interface{}) (*models.UserPreference, error) {
	var prefs models.UserPreference
	err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		First(&prefs).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			prefs = models.UserPreference{UserID: userID}
			if createErr := r.db.WithContext(ctx).Create(&prefs).Error; createErr != nil {
				return nil, createErr
			}
		} else {
			return nil, err
		}
	}

	if len(updates) > 0 {
		// Use Session to allow updating zero-values (e.g. enum strings)
		if err := r.db.WithContext(ctx).
			Model(&models.UserPreference{}).
			Session(&gorm.Session{FullSaveAssociations: false}).
			Where("user_id = ?", userID).
			Updates(updates).Error; err != nil {
			return nil, err
		}
	}

	if err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		First(&prefs).Error; err != nil {
		return nil, err
	}
	return &prefs, nil
}
