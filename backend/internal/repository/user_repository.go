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
	return nil, ErrNotImplemented
}

func (r *GormUserRepository) Create(ctx context.Context, user *models.User) error {
	return ErrNotImplemented
}

func (r *GormUserRepository) GetPreferences(ctx context.Context, userID uuid.UUID) (*models.UserPreference, error) {
	return nil, ErrNotImplemented
}

func (r *GormUserRepository) UpsertPreferences(ctx context.Context, userID uuid.UUID, updates map[string]interface{}) (*models.UserPreference, error) {
	return nil, ErrNotImplemented
}
