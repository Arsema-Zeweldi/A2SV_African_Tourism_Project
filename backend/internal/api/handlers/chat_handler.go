package handlers

import (
	"net/http"
	"strings"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/service/packages"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (h *PackagesHandler) PostChatMessage(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	if h.PackageService == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Service not configured"})
		return
	}

	packageID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid package ID"})
		return
	}

	var req ChatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if _, err := h.PackageService.GetByID(c.Request.Context(), packageID); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Package not found"})
		return
	}

	chatMsg := models.PackageChat{
		PackageID: packageID,
		UserID:    userID,
		Message:   req.Message,
	}

	if err := h.PackageService.PostChat(c.Request.Context(), &chatMsg); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to post message"})
		return
	}

	if h.DB != nil {
		var user models.User
		if err := h.DB.First(&user, "user_id = ?", userID).Error; err == nil {
			chatMsg.UserName = strings.TrimSpace(user.FirstName + " " + user.LastName)
			if chatMsg.UserName == "" {
				chatMsg.UserName = user.Email
			}
			chatMsg.UserAvatar = user.AvatarURL
		}
	}

	c.JSON(http.StatusCreated, chatMsg)
}

func (h *PackagesHandler) GetChatHistory(c *gin.Context) {
	packageID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid package ID"})
		return
	}
	if h.PackageService == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Service not configured"})
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

	messages, total, err := h.PackageService.GetChatHistory(c.Request.Context(), packageID, packages.ChatParams{Page: page, PageSize: pageSize})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch chat history"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": messages,
		"meta": gin.H{
			"page":      page,
			"page_size": pageSize,
			"total":     total,
		},
	})
}
