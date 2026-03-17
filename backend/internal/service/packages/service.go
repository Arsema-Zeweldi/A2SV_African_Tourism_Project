package packages

import (
	"context"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/google/uuid"
)

type FeedParams struct {
	Page       int
	PageSize   int
	Status     string
	CreatorID  *uuid.UUID
	Query      string
	MinPrice   *float64
	MaxPrice   *float64
	MinRating  *float64
	MinReviews *int
	UseRegex   bool
	SortBy     string
	Order      string
}

type ReviewParams struct {
	Page     int
	PageSize int
}

type ChatParams struct {
	Page     int
	PageSize int
}

// PackageService defines the contract for package-related operations.
type PackageService interface {
	GetFeed(ctx context.Context, params FeedParams) ([]models.Package, int64, error)
	GetByID(ctx context.Context, id uuid.UUID) (*models.Package, error)
	Create(ctx context.Context, pkg *models.Package, imageURL string) error
	Update(ctx context.Context, id uuid.UUID, updates map[string]interface{}, imageURL string) error
	Archive(ctx context.Context, id uuid.UUID) error
	Publish(ctx context.Context, id uuid.UUID) error
	UpdateStatus(ctx context.Context, id uuid.UUID, status string) error
	SubmitReview(ctx context.Context, review *models.PackageReview) (float64, int64, error)
	GetReviews(ctx context.Context, packageID uuid.UUID, params ReviewParams) ([]models.PackageReview, int64, error)
	PostChat(ctx context.Context, msg *models.PackageChat) error
	GetChatHistory(ctx context.Context, packageID uuid.UUID, params ChatParams) ([]models.PackageChat, int64, error)
	IncrementViews(ctx context.Context, packageID uuid.UUID) error
}
