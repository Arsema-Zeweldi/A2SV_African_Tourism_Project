package repository

import (
	"context"
	"strings"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// CommunityRepository defines the contract for community post data access.
type CommunityRepository interface {
	CreatePost(ctx context.Context, post *models.CommunityPost) error
	GetPost(ctx context.Context, postID uuid.UUID) (*models.CommunityPost, error)
	ListPosts(ctx context.Context, params Pagination, filters map[string]interface{}) ([]models.CommunityPost, int64, error)
	AddComment(ctx context.Context, comment *models.CommunityPostComment) error
	ListComments(ctx context.Context, postID uuid.UUID, params Pagination) ([]models.CommunityPostComment, int64, error)
	ToggleLike(ctx context.Context, postID, userID uuid.UUID) (bool, error)
}

// GormCommunityRepository is the GORM-based implementation.
type GormCommunityRepository struct {
	db *gorm.DB
}

func NewGormCommunityRepository(db *gorm.DB) *GormCommunityRepository {
	return &GormCommunityRepository{db: db}
}

func (r *GormCommunityRepository) CreatePost(ctx context.Context, post *models.CommunityPost) error {
	return r.db.WithContext(ctx).Create(post).Error
}

func (r *GormCommunityRepository) GetPost(ctx context.Context, postID uuid.UUID) (*models.CommunityPost, error) {
	var post models.CommunityPost
	if err := r.db.WithContext(ctx).
		Preload("User").
		First(&post, "post_id = ?", postID).Error; err != nil {
		return nil, err
	}
	return &post, nil
}

func (r *GormCommunityRepository) ListPosts(ctx context.Context, params Pagination, filters map[string]interface{}) ([]models.CommunityPost, int64, error) {
	q := r.db.WithContext(ctx).Model(&models.CommunityPost{})

	if status, ok := filters["status"].(string); ok && status != "" && status != "all" {
		q = q.Where("status = ?", status)
	}

	if userID, ok := filters["user_id"].(uuid.UUID); ok && userID != uuid.Nil {
		q = q.Where("user_id = ?", userID)
	}

	if query, ok := filters["q"].(string); ok && query != "" {
		like := "%" + query + "%"
		q = q.Where("content ILIKE ? OR location ILIKE ? OR package_name ILIKE ?", like, like, like)
	}

	var total int64
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	page, pageSize := normalizePagination(params)
	offset := (page - 1) * pageSize

	orderClause := "created_at DESC"
	if sortBy, ok := filters["sort"].(string); ok && sortBy != "" {
		allowed := map[string]string{
			"created_at":     "created_at",
			"likes_count":    "likes_count",
			"comments_count": "comments_count",
		}
		col, found := allowed[sortBy]
		if found {
			dir := "DESC"
			if order, ok := filters["order"].(string); ok && strings.ToUpper(order) == "ASC" {
				dir = "ASC"
			}
			orderClause = col + " " + dir
		}
	}

	var posts []models.CommunityPost
	if err := q.Preload("User").Order(orderClause).
		Limit(pageSize).
		Offset(offset).
		Find(&posts).Error; err != nil {
		return nil, 0, err
	}

	return posts, total, nil
}

func (r *GormCommunityRepository) AddComment(ctx context.Context, comment *models.CommunityPostComment) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(comment).Error; err != nil {
			return err
		}
		// Increment comments count on post
		return tx.Model(&models.CommunityPost{}).
			Where("post_id = ?", comment.PostID).
			UpdateColumn("comments_count", gorm.Expr("comments_count + ?", 1)).Error
	})
}

func (r *GormCommunityRepository) ListComments(ctx context.Context, postID uuid.UUID, params Pagination) ([]models.CommunityPostComment, int64, error) {
	q := r.db.WithContext(ctx).Model(&models.CommunityPostComment{}).
		Where("post_id = ?", postID)

	var total int64
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	page, pageSize := normalizePagination(params)
	offset := (page - 1) * pageSize

	var comments []models.CommunityPostComment
	if err := q.Preload("User").Order("created_at DESC").
		Limit(pageSize).
		Offset(offset).
		Find(&comments).Error; err != nil {
		return nil, 0, err
	}

	return comments, total, nil
}

func (r *GormCommunityRepository) ToggleLike(ctx context.Context, postID, userID uuid.UUID) (bool, error) {
	var liked bool
	err := r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var existing models.CommunityPostLike
		err := tx.Where("post_id = ? AND user_id = ?", postID, userID).First(&existing).Error

		if err == gorm.ErrRecordNotFound {
			// LIKE
			like := models.CommunityPostLike{PostID: postID, UserID: userID}
			if err := tx.Create(&like).Error; err != nil {
				return err
			}
			if err := tx.Model(&models.CommunityPost{}).
				Where("post_id = ?", postID).
				UpdateColumn("likes_count", gorm.Expr("likes_count + ?", 1)).Error; err != nil {
				return err
			}
			liked = true
			return nil
		} else if err != nil {
			return err
		}

		// UNLIKE
		if err := tx.Delete(&existing).Error; err != nil {
			return err
		}
		if err := tx.Model(&models.CommunityPost{}).
			Where("post_id = ?", postID).
			UpdateColumn("likes_count", gorm.Expr("likes_count - ?", 1)).Error; err != nil {
			return err
		}
		liked = false
		return nil
	})
	return liked, err
}
