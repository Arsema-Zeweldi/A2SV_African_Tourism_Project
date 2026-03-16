package community

import (
	"context"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/google/uuid"
)

// PackageService defines the contract for package-related operations.
type PackageService interface {
	GetFeed(ctx context.Context, params map[string]interface{}) ([]models.Package, int64, error)
	GetByID(ctx context.Context, id uuid.UUID) (*models.Package, error)
	Create(ctx context.Context, pkg *models.Package) error
	Update(ctx context.Context, id uuid.UUID, updates map[string]interface{}) error
	Archive(ctx context.Context, id uuid.UUID) error
	Publish(ctx context.Context, id uuid.UUID) error
	UpdateStatus(ctx context.Context, id uuid.UUID, status string) error
	SubmitReview(ctx context.Context, review *models.PackageReview) error
	GetReviews(ctx context.Context, packageID uuid.UUID, params map[string]interface{}) ([]models.PackageReview, int64, error)
	PostChat(ctx context.Context, msg *models.PackageChat) error
	GetChatHistory(ctx context.Context, packageID uuid.UUID, params map[string]interface{}) ([]models.PackageChat, int64, error)
}
