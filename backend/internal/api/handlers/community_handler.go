package handlers

import (
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

	// ID: 5 - Handle optional media upload
	mediaURL := req.MediaURL
	mediaType := req.MediaType

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

	post := models.CommunityPost{
		UserID:      userID,
		Content:     req.Content,
		MediaURL:    mediaURL,
		MediaType:   mediaType,
		Location:    req.Location,
		PackageName: req.PackageName,
	}

	if err := h.CommunitySvc.CreatePost(c.Request.Context(), &post); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create post"})
		return
	}

	c.JSON(http.StatusCreated, post)
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

	posts, total, err := h.CommunitySvc.ListPosts(c.Request.Context(), community.ListPostsParams{
		Page:     page,
		PageSize: pageSize,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch posts"})
		return
	}

	// Map to response DTO if needed, but for now using models + meta
	c.JSON(http.StatusOK, gin.H{
		"data": posts,
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

	c.JSON(http.StatusCreated, comment)
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

	c.JSON(http.StatusOK, gin.H{
		"data": comments,
		"meta": gin.H{
			"page":      page,
			"page_size": pageSize,
			"total":     total,
		},
	})
}

// Helper to keep time strings consistent with frontend "timeAgo" logic
func formatTimeAgo(t time.Time) string {
	// Simple placeholder. Real logic would be more complex.
	return t.Format(time.RFC3339)
}
