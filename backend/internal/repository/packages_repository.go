package repository

import (
	"context"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// PackageRepository defines the contract for package data access.
type PackageRepository interface {
	GetFeed(ctx context.Context, params Pagination, filters map[string]interface{}) ([]models.Package, int64, error)
	GetByID(ctx context.Context, id uuid.UUID) (*models.Package, error)
	Create(ctx context.Context, pkg *models.Package) error
	Update(ctx context.Context, id uuid.UUID, updates map[string]interface{}) error
	Archive(ctx context.Context, id uuid.UUID) error
	Publish(ctx context.Context, id uuid.UUID) error
	UpdateStatus(ctx context.Context, id uuid.UUID, status string) error
	SaveReview(ctx context.Context, review *models.PackageReview) error
	GetReviews(ctx context.Context, packageID uuid.UUID, params Pagination) ([]models.PackageReview, int64, error)
	SaveChatMessage(ctx context.Context, msg *models.PackageChat) error
	GetChatHistory(ctx context.Context, packageID uuid.UUID, params Pagination) ([]models.PackageChat, int64, error)
}

// GormPackageRepository is a placeholder implementation.
type GormPackageRepository struct {
	db *gorm.DB
}

func NewGormPackageRepository(db *gorm.DB) *GormPackageRepository {
	return &GormPackageRepository{db: db}
}

func (r *GormPackageRepository) GetFeed(ctx context.Context, params Pagination, filters map[string]interface{}) ([]models.Package, int64, error) {
	return nil, 0, ErrNotImplemented
}

func (r *GormPackageRepository) GetByID(ctx context.Context, id uuid.UUID) (*models.Package, error) {
	return nil, ErrNotImplemented
}

func (r *GormPackageRepository) Create(ctx context.Context, pkg *models.Package) error {
	return ErrNotImplemented
}

func (r *GormPackageRepository) Update(ctx context.Context, id uuid.UUID, updates map[string]interface{}) error {
	return ErrNotImplemented
}

func (r *GormPackageRepository) Archive(ctx context.Context, id uuid.UUID) error {
	return ErrNotImplemented
}

func (r *GormPackageRepository) Publish(ctx context.Context, id uuid.UUID) error {
	return ErrNotImplemented
}

func (r *GormPackageRepository) UpdateStatus(ctx context.Context, id uuid.UUID, status string) error {
	return ErrNotImplemented
}

func (r *GormPackageRepository) SaveReview(ctx context.Context, review *models.PackageReview) error {
	return ErrNotImplemented
}

func (r *GormPackageRepository) GetReviews(ctx context.Context, packageID uuid.UUID, params Pagination) ([]models.PackageReview, int64, error) {
	return nil, 0, ErrNotImplemented
}

func (r *GormPackageRepository) SaveChatMessage(ctx context.Context, msg *models.PackageChat) error {
	return ErrNotImplemented
}

func (r *GormPackageRepository) GetChatHistory(ctx context.Context, packageID uuid.UUID, params Pagination) ([]models.PackageChat, int64, error) {
	return nil, 0, ErrNotImplemented
}
