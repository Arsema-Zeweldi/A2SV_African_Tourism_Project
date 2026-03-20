package handlers

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/service/community"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (h *AppHandler) CreatePost(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	if h.CommunitySvc == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Community service not configured"})
		return
	}

	var req CreatePostRequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Handle optional media upload
	mediaURL := req.MediaURL
	mediaType := req.MediaType
	if mediaType == "" && mediaURL != "" {
		mediaType = "image" // default if URL provided without type
	}

	file, err := c.FormFile("media")
	if err == nil {
		f, err := file.Open()
		if err == nil {
			defer f.Close()
			contentType := file.Header.Get("Content-Type")
			if strings.HasPrefix(contentType, "image/") {
				url, err := h.UploadSvc.UploadImage(c.Request.Context(), f, "posts")
				if err == nil {
					mediaURL = url
					mediaType = "image"
				}
			} else if strings.HasPrefix(contentType, "video/") {
				url, err := h.UploadSvc.UploadVideo(c.Request.Context(), f, "posts")
				if err == nil {
					mediaURL = url
					mediaType = "video"
				}
			}
		}
	}

	tagsJSON, _ := json.Marshal(req.Tags)
	post := models.CommunityPost{
		UserID:      userID,
		Content:     req.Content,
		MediaURL:    mediaURL,
		MediaType:   mediaType,
		Location:    req.Location,
		PackageName: req.PackageName,
		Tags:        tagsJSON,
	}

	if err := h.CommunitySvc.CreatePost(c.Request.Context(), &post); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create post"})
		return
	}

	// Fetch author data for response
	fullPost, err := h.CommunitySvc.GetPost(c.Request.Context(), post.PostID)
	if err == nil {
		post = *fullPost
	}

	c.JSON(http.StatusCreated, mapPostToResponse(post))
}

func (h *AppHandler) GetPost(c *gin.Context) {
	if h.CommunitySvc == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Community service not configured"})
		return
	}

	postID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	post, err := h.CommunitySvc.GetPost(c.Request.Context(), postID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	c.JSON(http.StatusOK, mapPostToResponse(*post))
}

func (h *AppHandler) ListPosts(c *gin.Context) {
	if h.CommunitySvc == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Community service not configured"})
		return
	}

	page := 1
	pageSize := 20
	if p, err := parseInt(c.Query("page")); err == nil && p > 0 {
		page = p
	}
	if ps, err := parseInt(c.Query("page_size")); err == nil && ps > 0 && ps <= 100 {
		pageSize = ps
	}

	var userIDPtr *uuid.UUID
	if uidStr := c.Query("user_id"); uidStr != "" {
		if uid, err := uuid.Parse(uidStr); err == nil {
			userIDPtr = &uid
		}
	}

	posts, total, err := h.CommunitySvc.ListPosts(c.Request.Context(), community.ListPostsParams{
		Page:     page,
		PageSize: pageSize,
		Status:   c.Query("status"),
		UserID:   userIDPtr,
		Query:    c.Query("q"),
		SortBy:   c.Query("sort_by"),
		Order:    c.Query("order"),
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch posts"})
		return
	}

	resp := make([]PostResponse, len(posts))
	for i, p := range posts {
		resp[i] = mapPostToResponse(p)
	}

	c.JSON(http.StatusOK, gin.H{
		"data": resp,
		"meta": gin.H{
			"page":      page,
			"page_size": pageSize,
			"total":     total,
		},
	})
}

func (h *AppHandler) AddComment(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	if h.CommunitySvc == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Community service not configured"})
		return
	}

	postID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	var req CreateCommentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	comment := models.CommunityPostComment{
		PostID: postID,
		UserID: userID,
		Text:   req.Text,
	}

	if err := h.CommunitySvc.AddComment(c.Request.Context(), &comment); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add comment"})
		return
	}

	// Fetch minimal author info for the response
	resp := mapCommentToResponse(comment)
	if h.UserService != nil {
		if profile, err := h.UserService.GetProfile(c.Request.Context(), userID.String()); err == nil {
			resp.UserName = profile.FirstName + " " + profile.LastName
			resp.UserAvatar = profile.AvatarURL
		}
	}

	c.JSON(http.StatusCreated, resp)
}

func (h *AppHandler) ToggleLikePost(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	if h.CommunitySvc == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Community service not configured"})
		return
	}

	postID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	liked, err := h.CommunitySvc.ToggleLike(c.Request.Context(), postID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to toggle like"})
		return
	}

	status := "unliked"
	if liked {
		status = "liked"
	}

	c.JSON(http.StatusOK, gin.H{"message": "Post " + status, "liked": liked})
}

func (h *AppHandler) ListComments(c *gin.Context) {
	if h.CommunitySvc == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Community service not configured"})
		return
	}

	postID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	page := 1
	pageSize := 50
	if p, err := parseInt(c.Query("page")); err == nil && p > 0 {
		page = p
	}
	if ps, err := parseInt(c.Query("page_size")); err == nil && ps > 0 && ps <= 200 {
		pageSize = ps
	}

	comments, total, err := h.CommunitySvc.ListComments(c.Request.Context(), postID, community.ListCommentsParams{
		Page:     page,
		PageSize: pageSize,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch comments"})
		return
	}

	resp := make([]CommentResponse, len(comments))
	for i, com := range comments {
		resp[i] = mapCommentToResponse(com)
	}

	c.JSON(http.StatusOK, gin.H{
		"data": resp,
		"meta": gin.H{
			"page":      page,
			"page_size": pageSize,
			"total":     total,
		},
	})
}

func (h *AppHandler) DeleteComment(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	if h.CommunitySvc == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Community service not configured"})
		return
	}

	commentID, err := uuid.Parse(c.Param("commentId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid comment ID"})
		return
	}

	if err := h.CommunitySvc.DeleteComment(c.Request.Context(), commentID, userID); err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "Failed to delete comment or unauthorized"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Comment deleted successfully"})
}

func mapPostToResponse(p models.CommunityPost) PostResponse {
	return PostResponse{
		PostID:        p.PostID,
		UserID:        p.UserID,
		UserName:      p.User.FirstName + " " + p.User.LastName,
		UserAvatar:    p.User.AvatarURL,
		Content:       p.Content,
		MediaURL:      p.MediaURL,
		MediaType:     p.MediaType,
		Location:      p.Location,
		PackageName:   p.PackageName,
		LikesCount:    p.LikesCount,
		CommentsCount: p.CommentsCount,
		Tags:          p.Tags,
		CreatedAt:     p.CreatedAt.Format(time.RFC3339),
		Status:        p.Status,
	}
}

func mapCommentToResponse(c models.CommunityPostComment) CommentResponse {
	return CommentResponse{
		CommentID:  c.CommentID,
		PostID:     c.PostID,
		UserID:     c.UserID,
		UserName:   c.User.FirstName + " " + c.User.LastName,
		UserAvatar: c.User.AvatarURL,
		Text:       c.Text,
		CreatedAt:  c.CreatedAt.Format(time.RFC3339),
	}
}

// Helper to keep time strings consistent with frontend "timeAgo" logic
func formatTimeAgo(t time.Time) string {
	// Simple placeholder. Real logic would be more complex.
	return t.Format(time.RFC3339)
}
