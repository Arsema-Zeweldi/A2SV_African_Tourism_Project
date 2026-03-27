package packages

import (
	"context"
	"errors"
	"strings"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/repository"
	"github.com/google/uuid"
)

// PackageServiceImpl is a placeholder implementation.
type PackageServiceImpl struct {
	repo repository.PackageRepository
}

func NewPackageService(repo repository.PackageRepository) *PackageServiceImpl {
	return &PackageServiceImpl{repo: repo}
}

func (s *PackageServiceImpl) GetFeed(ctx context.Context, params FeedParams) ([]models.Package, int64, error) {
	filters := map[string]interface{}{}
	if params.Status != "" {
		filters["status"] = params.Status
	}
	if params.CreatorID != nil {
		filters["creator_id"] = *params.CreatorID
	}
	if strings.TrimSpace(params.Query) != "" {
		filters["q"] = strings.TrimSpace(params.Query)
	}
	if params.MinPrice != nil {
		filters["min_price"] = *params.MinPrice
	}
	if params.MaxPrice != nil {
		filters["max_price"] = *params.MaxPrice
	}
	if params.MinRating != nil {
		filters["min_rating"] = *params.MinRating
	}
	if params.MinReviews != nil {
		filters["min_reviews"] = *params.MinReviews
	}
	if params.UseRegex {
		filters["use_regex"] = true
	}
	if params.SortBy != "" {
		filters["sort"] = repository.Sort{Field: params.SortBy, Order: params.Order}
	}

	return s.repo.GetFeed(ctx, repository.Pagination{Page: params.Page, PageSize: params.PageSize}, filters)
}

func (s *PackageServiceImpl) GetByID(ctx context.Context, id uuid.UUID) (*models.Package, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *PackageServiceImpl) Create(ctx context.Context, pkg *models.Package, imageURL string) error {
	if pkg == nil {
		return errors.New("package is nil")
	}
	if imageURL != "" {
		pkg.ImageURL = imageURL
	}
	if pkg.CreatorID == uuid.Nil {
		return errors.New("creator_id is required")
	}
	if pkg.ItineraryID == uuid.Nil {
		return errors.New("itinerary_id is required")
	}
	pkg.Title = strings.TrimSpace(pkg.Title)
	if pkg.Title == "" {
		return errors.New("title is required")
	}
	pkg.Summary = strings.TrimSpace(pkg.Summary)
	pkg.Description = strings.TrimSpace(pkg.Description)
	pkg.Country = strings.TrimSpace(pkg.Country)
	pkg.Location = strings.TrimSpace(pkg.Location)
	pkg.Currency = strings.TrimSpace(pkg.Currency)
	pkg.ImageURL = strings.TrimSpace(pkg.ImageURL)
	pkg.Category = strings.TrimSpace(pkg.Category)
	pkg.GroupSize = strings.TrimSpace(pkg.GroupSize)
	return s.repo.Create(ctx, pkg)
}

func (s *PackageServiceImpl) Update(ctx context.Context, id uuid.UUID, updates map[string]interface{}, imageURL string) error {
	// ID: 2 - Set image_url in updates map if imageURL is provided
	if imageURL != "" {
		updates["image_url"] = imageURL
	}
	return s.repo.Update(ctx, id, updates)
}

func (s *PackageServiceImpl) Archive(ctx context.Context, id uuid.UUID) error {
	return s.repo.Archive(ctx, id)
}

func (s *PackageServiceImpl) Publish(ctx context.Context, id uuid.UUID) error {
	return s.repo.Publish(ctx, id)
}

func (s *PackageServiceImpl) UpdateStatus(ctx context.Context, id uuid.UUID, status string) error {
	if !isValidPackageStatus(status) {
		return errors.New("invalid package status")
	}
	return s.repo.UpdateStatus(ctx, id, status)
}

func (s *PackageServiceImpl) SubmitReview(ctx context.Context, review *models.PackageReview) (float64, int64, error) {
	if review == nil {
		return 0, 0, errors.New("review is nil")
	}
	if review.PackageID == uuid.Nil {
		return 0, 0, errors.New("package_id is required")
	}
	if review.UserID == uuid.Nil {
		return 0, 0, errors.New("user_id is required")
	}
	if review.Rating < 1 || review.Rating > 5 {
		return 0, 0, errors.New("rating must be between 1 and 5")
	}
	review.Comment = strings.TrimSpace(review.Comment)

	exists, err := s.repo.ReviewExists(ctx, review.PackageID, review.UserID)
	if err != nil {
		return 0, 0, err
	}
	if exists {
		return 0, 0, errors.New("you have already reviewed this package")
	}

	if err := s.repo.SaveReview(ctx, review); err != nil {
		return 0, 0, err
	}

	avg, count, err := s.repo.UpdateReviewStats(ctx, review.PackageID)
	if err != nil {
		return 0, 0, err
	}

	return avg, count, nil
}

func (s *PackageServiceImpl) GetReviews(ctx context.Context, packageID uuid.UUID, params ReviewParams) ([]models.PackageReview, int64, error) {
	if packageID == uuid.Nil {
		return nil, 0, errors.New("package_id is required")
	}
	return s.repo.GetReviews(ctx, packageID, repository.Pagination{Page: params.Page, PageSize: params.PageSize})
}

func (s *PackageServiceImpl) DeleteReview(ctx context.Context, reviewID uuid.UUID, packageID uuid.UUID, userID uuid.UUID) error {
	if reviewID == uuid.Nil {
		return errors.New("review_id is required")
	}
	if err := s.repo.DeleteReview(ctx, reviewID, packageID, userID); err != nil {
		return err
	}
	
	// Recalculate and update the package's review stats after deletion
	_, _, err := s.repo.UpdateReviewStats(ctx, packageID)
	return err
}

func (s *PackageServiceImpl) PostChat(ctx context.Context, msg *models.PackageChat) error {
	if msg == nil {
		return errors.New("chat message is nil")
	}
	if msg.PackageID == uuid.Nil {
		return errors.New("package_id is required")
	}
	if msg.UserID == uuid.Nil {
		return errors.New("user_id is required")
	}
	msg.Message = strings.TrimSpace(msg.Message)
	if msg.Message == "" {
		return errors.New("message is required")
	}
	return s.repo.SaveChatMessage(ctx, msg)
}

func (s *PackageServiceImpl) GetChatHistory(ctx context.Context, packageID uuid.UUID, params ChatParams) ([]models.PackageChat, int64, error) {
	if packageID == uuid.Nil {
		return nil, 0, errors.New("package_id is required")
	}
	return s.repo.GetChatHistory(ctx, packageID, repository.Pagination{Page: params.Page, PageSize: params.PageSize})
}

func (s *PackageServiceImpl) IncrementViews(ctx context.Context, packageID uuid.UUID) error {
	if packageID == uuid.Nil {
		return errors.New("package_id is required")
	}
	return s.repo.IncrementViews(ctx, packageID)
}

func isValidPackageStatus(status string) bool {
	switch status {
	case "private", "public", "archived":
		return true
	default:
		return false
	}
}
