package handlers

import (
	"net/http"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/service/upload"
	"github.com/gin-gonic/gin"
)

// UploadHandler handles file uploads (images and videos).
type UploadHandler struct {
	UploadSvc upload.UploadService
}

// NewUploadHandler creates a new instance of UploadHandler with the provided service.
func NewUploadHandler(svc upload.UploadService) *UploadHandler {
	return &UploadHandler{UploadSvc: svc}
}

// UploadImage handles POST /api/v1/upload/image
func (h *UploadHandler) UploadImage(c *gin.Context) {
	if h.UploadSvc == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Cloudinary storage not configured"})
		return
	}
	file, _, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Multipart form field 'file' is required"})
		return
	}
	defer file.Close()

	folder := c.DefaultQuery("folder", "general")

	url, err := h.UploadSvc.UploadImage(c.Request.Context(), file, folder)
	if err != nil {
		status := http.StatusInternalServerError
		if err == upload.ErrFileTooLarge || err == upload.ErrInvalidFileType {
			status = http.StatusBadRequest
		}
		c.JSON(status, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"url": url})
}

// UploadVideo handles POST /api/v1/upload/video
func (h *UploadHandler) UploadVideo(c *gin.Context) {
	if h.UploadSvc == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Cloudinary storage not configured"})
		return
	}
	file, _, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Multipart form field 'file' is required"})
		return
	}
	defer file.Close()

	folder := c.DefaultQuery("folder", "posts")

	url, err := h.UploadSvc.UploadVideo(c.Request.Context(), file, folder)
	if err != nil {
		status := http.StatusInternalServerError
		if err == upload.ErrFileTooLarge || err == upload.ErrInvalidFileType {
			status = http.StatusBadRequest
		}
		c.JSON(status, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"url": url})
}
