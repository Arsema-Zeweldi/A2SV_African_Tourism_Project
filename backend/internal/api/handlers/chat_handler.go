package handlers

import (
	"log/slog"
	"net/http"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"gorm.io/gorm"
)

func (h *PackagesHandler) PostChatMessage(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
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

	var pkg models.Package
	if err := h.DB.First(&pkg, "package_id = ?", packageID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Package not found"})
		return
	}

	chatMsg := models.PackageChat{
		PackageID: packageID,
		UserID:    userID,
		Message:   req.Message,
	}

	if err := h.DB.Create(&chatMsg).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to post message"})
		return
	}

	if GlobalHub != nil {
		GlobalHub.BroadcastToPackage(packageID, chatMsg)
	}

	c.JSON(http.StatusCreated, chatMsg)
}

func (h *PackagesHandler) GetChatHistory(c *gin.Context) {
	packageID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid package ID"})
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
	offset := (page - 1) * pageSize

	var messages []models.PackageChat
	var total int64

	if err := h.DB.Model(&models.PackageChat{}).Where("package_id = ?", packageID).Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count chat messages"})
		return
	}

	if err := h.DB.
		Where("package_id = ?", packageID).
		Order("created_at ASC").
		Limit(pageSize).
		Offset(offset).
		Find(&messages).Error; err != nil {
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

func ServeWS(hub *Hub, db *gorm.DB, allowedOrigins []string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, err := getUserID(c)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		packageID, err := uuid.Parse(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid package ID"})
			return
		}

		var pkg models.Package
		if err := db.First(&pkg, "package_id = ?", packageID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Package not found"})
			return
		}

		localUpgrader := websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin: func(r *http.Request) bool {
				origin := r.Header.Get("Origin")
				if origin == "" {
					return true
				}
				for _, allowed := range allowedOrigins {
					if allowed == "*" || allowed == origin {
						return true
					}
				}
				return false
			},
		}

		conn, err := localUpgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			slog.Warn("ChatHub upgrade error", "error", err)
			return
		}

		client := &Client{
			hub:       hub,
			conn:      conn,
			send:      make(chan []byte, 256),
			packageID: packageID,
			userID:    userID,
		}

		hub.register <- client

		go client.writePump()
		go client.readPump(db)
	}
}
