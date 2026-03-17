package middleware

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

const (
	MaxImageSize = 10 * 1024 * 1024  // 10MB
	MaxVideoSize = 100 * 1024 * 1024 // 100MB
)

var (
	allowedImageTypes = map[string]bool{
		"image/jpeg": true,
		"image/jpg":  true,
		"image/png":  true,
		"image/webp": true,
		"image/gif":  true,
	}
	allowedVideoTypes = map[string]bool{
		"video/mp4":       true,
		"video/quicktime": true, // .mov
		"video/webm":      true,
		"video/x-m4v":     true,
	}
)

// ImageUploadMiddleware validates that the multipart form file "file"
// is within the 10MB limit and is one of the allowed image types.
func ImageUploadMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		file, err := c.FormFile("file")
		if err != nil {
			// Also check for "image" field as per part 6 of the request
			file, err = c.FormFile("image")
			if err != nil {
				// And "media" for Step 7
				file, err = c.FormFile("media")
			}
		}

		// If no file, continue (let the handler decide if it's optional)
		if err == http.ErrMissingFile {
			c.Next()
			return
		}

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get file"})
			c.Abort()
			return
		}

		// Check Size
		if file.Size > MaxImageSize {
			c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Image too large. Max size is %dMB", MaxImageSize/1024/1024)})
			c.Abort()
			return
		}

		// Check MIME Type
		contentType := file.Header.Get("Content-Type")
		if !allowedImageTypes[strings.ToLower(contentType)] {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Unsupported image format. Please upload JPEG, JPG, PNG, WEBP, or GIF."})
			c.Abort()
			return
		}

		c.Next()
	}
}

// VideoUploadMiddleware validates that the multipart form file "file"
// is within the 100MB limit and is one of the allowed video types.
func VideoUploadMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		file, err := c.FormFile("file")
		if err != nil {
			file, err = c.FormFile("media") // Common field for community posts
		}

		// If no file, continue
		if err == http.ErrMissingFile {
			c.Next()
			return
		}

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get file"})
			c.Abort()
			return
		}

		// Check Size
		if file.Size > MaxVideoSize {
			c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Video too large. Max size is %dMB", MaxVideoSize/1024/1024)})
			c.Abort()
			return
		}

		// Check MIME Type
		contentType := file.Header.Get("Content-Type")
		if !allowedVideoTypes[strings.ToLower(contentType)] {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Unsupported video format. Please upload MP4, MOV (QuickTime), WEBM, or M4V."})
			c.Abort()
			return
		}

		c.Next()
	}
}
