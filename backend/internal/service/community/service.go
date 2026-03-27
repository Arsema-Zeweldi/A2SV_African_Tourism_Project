package community

import (
	"context"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/google/uuid"
)

type ListPostsParams struct {
	Page     int
	PageSize int
	Status   string
	UserID   *uuid.UUID
	Query    string
	SortBy   string
	Order    string
}

type ListCommentsParams struct {
	Page     int
	PageSize int
}

// CommunityService defines community post operations.
type CommunityService interface {
	CreatePost(ctx context.Context, post *models.CommunityPost) error
	GetPost(ctx context.Context, postID uuid.UUID) (*models.CommunityPost, error)
	ListPosts(ctx context.Context, params ListPostsParams) ([]models.CommunityPost, int64, error)
	AddComment(ctx context.Context, comment *models.CommunityPostComment) error
	GetComment(ctx context.Context, commentID uuid.UUID) (*models.CommunityPostComment, error)
	ListComments(ctx context.Context, postID uuid.UUID, params ListCommentsParams) ([]models.CommunityPostComment, int64, error)
	ToggleLike(ctx context.Context, postID, userID uuid.UUID) (bool, error)
	DeleteComment(ctx context.Context, commentID, userID uuid.UUID) error
}
