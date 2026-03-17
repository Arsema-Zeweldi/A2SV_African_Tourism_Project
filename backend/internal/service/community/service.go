package community

import (
	"context"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/google/uuid"
)

type ListPostsParams struct {
	Page     int
	PageSize int
}

type ListCommentsParams struct {
	Page     int
	PageSize int
}

// CommunityService defines community post operations.
type CommunityService interface {
	CreatePost(ctx context.Context, post *models.CommunityPost) error
	ListPosts(ctx context.Context, params ListPostsParams) ([]models.CommunityPost, int64, error)
	AddComment(ctx context.Context, comment *models.CommunityPostComment) error
	ListComments(ctx context.Context, postID uuid.UUID, params ListCommentsParams) ([]models.CommunityPostComment, int64, error)
}
