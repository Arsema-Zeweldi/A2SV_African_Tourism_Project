package repository

import (
	"context"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// CommunityRepository defines the contract for community post data access.
type CommunityRepository interface {
	CreatePost(ctx context.Context, post *models.CommunityPost) error
	ListPosts(ctx context.Context, params Pagination) ([]models.CommunityPost, int64, error)
	AddComment(ctx context.Context, comment *models.CommunityPostComment) error
	ListComments(ctx context.Context, postID uuid.UUID, params Pagination) ([]models.CommunityPostComment, int64, error)
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

func (r *GormCommunityRepository) ListPosts(ctx context.Context, params Pagination) ([]models.CommunityPost, int64, error) {
	q := r.db.WithContext(ctx).Model(&models.CommunityPost{})

	var total int64
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	page, pageSize := normalizePagination(params)
	offset := (page - 1) * pageSize

	var posts []models.CommunityPost
	if err := q.Order("created_at DESC").
		Limit(pageSize).
		Offset(offset).
		Find(&posts).Error; err != nil {
		return nil, 0, err
	}

	return posts, total, nil
}

func (r *GormCommunityRepository) AddComment(ctx context.Context, comment *models.CommunityPostComment) error {
	return r.db.WithContext(ctx).Create(comment).Error
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
	if err := q.Order("created_at DESC").
		Limit(pageSize).
		Offset(offset).
		Find(&comments).Error; err != nil {
		return nil, 0, err
	}

	return comments, total, nil
}
