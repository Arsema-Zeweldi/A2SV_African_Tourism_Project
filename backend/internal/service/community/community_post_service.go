package community

import (
	"context"
	"errors"
	"strings"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/repository"
	"github.com/google/uuid"
)

// CommunityServiceImpl implements CommunityService.
type CommunityServiceImpl struct {
	repo repository.CommunityRepository
}

func NewCommunityService(repo repository.CommunityRepository) *CommunityServiceImpl {
	return &CommunityServiceImpl{repo: repo}
}

func (s *CommunityServiceImpl) CreatePost(ctx context.Context, post *models.CommunityPost) error {
	if post == nil {
		return errors.New("post is nil")
	}
	post.Content = strings.TrimSpace(post.Content)
	post.Location = strings.TrimSpace(post.Location)
	post.PackageName = strings.TrimSpace(post.PackageName)
	post.MediaURL = strings.TrimSpace(post.MediaURL)
	post.MediaType = strings.TrimSpace(post.MediaType)
	if post.UserID == uuid.Nil {
		return errors.New("user_id is required")
	}
	if post.Content == "" {
		return errors.New("content is required")
	}
	return s.repo.CreatePost(ctx, post)
}

func (s *CommunityServiceImpl) GetPost(ctx context.Context, postID uuid.UUID) (*models.CommunityPost, error) {
	if postID == uuid.Nil {
		return nil, errors.New("post_id is required")
	}
	return s.repo.GetPost(ctx, postID)
}

func (s *CommunityServiceImpl) ListPosts(ctx context.Context, params ListPostsParams) ([]models.CommunityPost, int64, error) {
	filters := make(map[string]interface{})
	if params.UserID != nil {
		filters["user_id"] = *params.UserID
	}
	filters["status"] = params.Status
	filters["q"] = params.Query
	filters["sort"] = params.SortBy
	filters["order"] = params.Order

	return s.repo.ListPosts(ctx, repository.Pagination{Page: params.Page, PageSize: params.PageSize}, filters)
}

func (s *CommunityServiceImpl) AddComment(ctx context.Context, comment *models.CommunityPostComment) error {
	if comment == nil {
		return errors.New("comment is nil")
	}
	comment.Text = strings.TrimSpace(comment.Text)
	if comment.UserID == uuid.Nil {
		return errors.New("user_id is required")
	}
	if comment.PostID == uuid.Nil {
		return errors.New("post_id is required")
	}
	if comment.Text == "" {
		return errors.New("text is required")
	}
	return s.repo.AddComment(ctx, comment)
}

func (s *CommunityServiceImpl) GetComment(ctx context.Context, commentID uuid.UUID) (*models.CommunityPostComment, error) {
	if commentID == uuid.Nil {
		return nil, errors.New("comment_id is required")
	}
	return s.repo.GetComment(ctx, commentID)
}

func (s *CommunityServiceImpl) ListComments(ctx context.Context, postID uuid.UUID, params ListCommentsParams) ([]models.CommunityPostComment, int64, error) {
	if postID == uuid.Nil {
		return nil, 0, errors.New("post_id is required")
	}
	return s.repo.ListComments(ctx, postID, repository.Pagination{Page: params.Page, PageSize: params.PageSize})
}

func (s *CommunityServiceImpl) ToggleLike(ctx context.Context, postID, userID uuid.UUID) (bool, error) {
	if postID == uuid.Nil || userID == uuid.Nil {
		return false, errors.New("post_id and user_id are required")
	}
	return s.repo.ToggleLike(ctx, postID, userID)
}

func (s *CommunityServiceImpl) DeleteComment(ctx context.Context, commentID, userID uuid.UUID) error {
	if commentID == uuid.Nil || userID == uuid.Nil {
		return errors.New("comment_id and user_id are required")
	}
	return s.repo.DeleteComment(ctx, commentID, userID)
}
