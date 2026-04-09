package repository

import (
	"context"
	"fmt"
	"strings"

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
	ReviewExists(ctx context.Context, packageID uuid.UUID, userID uuid.UUID) (bool, error)
	UpdateReviewStats(ctx context.Context, packageID uuid.UUID) (float64, int64, error)
	GetReviews(ctx context.Context, packageID uuid.UUID, params Pagination) ([]models.PackageReview, int64, error)
	DeleteReview(ctx context.Context, reviewID uuid.UUID, packageID uuid.UUID, userID uuid.UUID) error
	SaveChatMessage(ctx context.Context, msg *models.PackageChat) error
	GetChatHistory(ctx context.Context, packageID uuid.UUID, params Pagination) ([]models.PackageChat, int64, error)
	IncrementViews(ctx context.Context, packageID uuid.UUID) error
}

// GormPackageRepository is a placeholder implementation.
type GormPackageRepository struct {
	db *gorm.DB
}

func NewGormPackageRepository(db *gorm.DB) *GormPackageRepository {
	return &GormPackageRepository{db: db}
}

func resolveUserDisplay(user models.User) (string, string) {
	name := strings.TrimSpace(fmt.Sprintf("%s %s", user.FirstName, user.LastName))
	if name == "" {
		name = user.Email
	}

	return name, user.AvatarURL
}

func (r *GormPackageRepository) GetFeed(ctx context.Context, params Pagination, filters map[string]interface{}) ([]models.Package, int64, error) {
	q := r.db.WithContext(ctx).Model(&models.Package{})

	if status, ok := filters["status"].(string); ok && status != "" {
		q = q.Where("status = ?", status)
	}
	if creatorID, ok := filters["creator_id"].(uuid.UUID); ok {
		q = q.Where("creator_id = ?", creatorID)
	}
	if query, ok := filters["q"].(string); ok && strings.TrimSpace(query) != "" {
		trimmed := strings.TrimSpace(query)
		if useRegex, ok := filters["use_regex"].(bool); ok && useRegex {
			q = q.Where("title ~* ? OR summary ~* ? OR description ~* ? OR country ~* ? OR location ~* ? OR category ~* ?", 
				trimmed, trimmed, trimmed, trimmed, trimmed, trimmed)
		} else {
			like := "%" + trimmed + "%"
			q = q.Where("title ILIKE ? OR summary ILIKE ? OR description ILIKE ? OR country ILIKE ? OR location ILIKE ? OR category ILIKE ?", 
				like, like, like, like, like, like)
		}
	}
	if minPrice, ok := filters["min_price"].(float64); ok {
		q = q.Where("price >= ?", minPrice)
	}
	if maxPrice, ok := filters["max_price"].(float64); ok {
		q = q.Where("price <= ?", maxPrice)
	}
	if minRating, ok := filters["min_rating"].(float64); ok {
		q = q.Where("rating_avg >= ?", minRating)
	}
	if minReviews, ok := filters["min_reviews"].(int); ok {
		q = q.Where("reviews_count >= ?", minReviews)
	}

	var total int64
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	page, pageSize := normalizePagination(params)
	offset := (page - 1) * pageSize

	orderClause := "rating_avg DESC, reviews_count DESC"
	if sortField, ok := filters["sort"].(Sort); ok && sortField.Field != "" {
		allowed := map[string]string{
			"rating_avg": "rating_avg",
			"price":      "price",
			"reviews":    "reviews_count",
			"views":      "views_count",
		}
		col, ok := allowed[sortField.Field]
		if ok {
			dir := "DESC"
			if strings.ToUpper(sortField.Order) == "ASC" {
				dir = "ASC"
			}
			orderClause = fmt.Sprintf("%s %s", col, dir)
		}
	}

	var packages []models.Package
	if err := q.Order(orderClause).
		Preload("Creator").
		Limit(pageSize).
		Offset(offset).
		Find(&packages).Error; err != nil {
		return nil, 0, err
	}

	for i := range packages {
		packages[i].CreatorName, packages[i].CreatorAvatar = resolveUserDisplay(packages[i].Creator)
	}

	return packages, total, nil
}

func (r *GormPackageRepository) GetByID(ctx context.Context, id uuid.UUID) (*models.Package, error) {
	var pkg models.Package
	if err := r.db.WithContext(ctx).
		Preload("Creator").
		Preload("Itinerary").
		Preload("Itinerary.Activities").
		First(&pkg, "package_id = ?", id).Error; err != nil {
		return nil, err
	}

	pkg.CreatorName, pkg.CreatorAvatar = resolveUserDisplay(pkg.Creator)

	return &pkg, nil
}

func (r *GormPackageRepository) Create(ctx context.Context, pkg *models.Package) error {
	return r.db.WithContext(ctx).Create(pkg).Error
}

func (r *GormPackageRepository) Update(ctx context.Context, id uuid.UUID, updates map[string]interface{}) error {
	return r.db.WithContext(ctx).
		Model(&models.Package{}).
		Where("package_id = ?", id).
		Updates(updates).Error
}

func (r *GormPackageRepository) Archive(ctx context.Context, id uuid.UUID) error {
	return r.UpdateStatus(ctx, id, "archived")
}

func (r *GormPackageRepository) Publish(ctx context.Context, id uuid.UUID) error {
	return r.UpdateStatus(ctx, id, "public")
}

func (r *GormPackageRepository) UpdateStatus(ctx context.Context, id uuid.UUID, status string) error {
	return r.db.WithContext(ctx).
		Model(&models.Package{}).
		Where("package_id = ?", id).
		Update("status", status).Error
}

func (r *GormPackageRepository) SaveReview(ctx context.Context, review *models.PackageReview) error {
	return r.db.WithContext(ctx).Create(review).Error
}

func (r *GormPackageRepository) ReviewExists(ctx context.Context, packageID uuid.UUID, userID uuid.UUID) (bool, error) {
	var count int64
	if err := r.db.WithContext(ctx).
		Model(&models.PackageReview{}).
		Where("package_id = ? AND user_id = ?", packageID, userID).
		Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *GormPackageRepository) UpdateReviewStats(ctx context.Context, packageID uuid.UUID) (float64, int64, error) {
	var stats struct {
		Avg   float64
		Count int64
	}
	if err := r.db.WithContext(ctx).
		Model(&models.PackageReview{}).
		Select("COALESCE(ROUND(AVG(rating)::numeric, 2), 0) as avg, COUNT(*) as count").
		Where("package_id = ?", packageID).
		Scan(&stats).Error; err != nil {
		return 0, 0, err
	}

	if err := r.db.WithContext(ctx).
		Model(&models.Package{}).
		Where("package_id = ?", packageID).
		Updates(map[string]interface{}{
			"rating_avg":    stats.Avg,
			"reviews_count": stats.Count,
		}).Error; err != nil {
		return 0, 0, err
	}

	return stats.Avg, stats.Count, nil
}

func (r *GormPackageRepository) GetReviews(ctx context.Context, packageID uuid.UUID, params Pagination) ([]models.PackageReview, int64, error) {
	q := r.db.WithContext(ctx).Model(&models.PackageReview{}).
		Where("package_id = ?", packageID)

	var total int64
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	page, pageSize := normalizePagination(params)
	offset := (page - 1) * pageSize

	var reviews []models.PackageReview
	if err := q.Order("created_at DESC").
		Limit(pageSize).
		Offset(offset).
		Find(&reviews).Error; err != nil {
		return nil, 0, err
	}

	return reviews, total, nil
}

func (r *GormPackageRepository) DeleteReview(ctx context.Context, reviewID uuid.UUID, packageID uuid.UUID, userID uuid.UUID) error {
	result := r.db.WithContext(ctx).
		Where("review_id = ? AND package_id = ? AND user_id = ?", reviewID, packageID, userID).
		Delete(&models.PackageReview{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return fmt.Errorf("review not found or you are not the author")
	}
	return nil
}

func (r *GormPackageRepository) SaveChatMessage(ctx context.Context, msg *models.PackageChat) error {
	return r.db.WithContext(ctx).Create(msg).Error
}

func (r *GormPackageRepository) GetChatHistory(ctx context.Context, packageID uuid.UUID, params Pagination) ([]models.PackageChat, int64, error) {
	q := r.db.WithContext(ctx).Model(&models.PackageChat{}).
		Where("package_id = ?", packageID)

	var total int64
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	page, pageSize := normalizePagination(params)
	offset := (page - 1) * pageSize

	var chats []models.PackageChat
	if err := q.Order("created_at DESC").
		Preload("User").
		Limit(pageSize).
		Offset(offset).
		Find(&chats).Error; err != nil {
		return nil, 0, err
	}

	for i := range chats {
		chats[i].UserName, chats[i].UserAvatar = resolveUserDisplay(chats[i].User)
	}

	return chats, total, nil
}

func (r *GormPackageRepository) IncrementViews(ctx context.Context, packageID uuid.UUID) error {
	return r.db.WithContext(ctx).
		Model(&models.Package{}).
		Where("package_id = ?", packageID).
		UpdateColumn("views_count", gorm.Expr("views_count + 1")).Error
}
