package handlers

import (
	"context"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/cache"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/config"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/service/ai_planner"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/service/community"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/service/itinerary"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/service/upload"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/service/user"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AppHandler struct {
	DB             *gorm.DB
	Cfg            *config.Config
	PlannerService ai_planner.PlannerService
	UserService    user.UserService
	ItinerarySvc   itinerary.ItineraryService
	CommunitySvc   community.CommunityService
	UploadSvc      upload.UploadService
	Cache          cache.Client
}

func NewAppHandler(
	db *gorm.DB,
	cfg *config.Config,
	planner ai_planner.PlannerService,
	userSvc user.UserService,
	itinerarySvc itinerary.ItineraryService,
	communitySvc community.CommunityService,
	uploadSvc upload.UploadService,
	cache cache.Client,
) *AppHandler {
	return &AppHandler{
		DB:             db,
		Cfg:            cfg,
		PlannerService: planner,
		UserService:    userSvc,
		ItinerarySvc:   itinerarySvc,
		CommunitySvc:   communitySvc,
		UploadSvc:      uploadSvc,
		Cache:          cache,
	}
}

// IAM Handlers

func (h *AppHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if h.UserService == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User service not configured"})
		return
	}

	firstName := req.FirstName
	lastName := req.LastName
	if firstName == "" && lastName == "" && req.Name != "" {
		parts := strings.Fields(req.Name)
		if len(parts) > 0 {
			firstName = parts[0]
		}
		if len(parts) > 1 {
			lastName = strings.Join(parts[1:], " ")
		}
	}

	userReq := user.RegisterRequest{
		Email:     req.Email,
		Password:  req.Password,
		FirstName: firstName,
		LastName:  lastName,
	}
	created, err := h.UserService.Register(c.Request.Context(), userReq)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}

	// Send verification email async
	go sendVerificationEmail(h, created.UserID, created.Email, created.FirstName)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Registration successful! Please check your email to verify your account.",
		"user_id": created.UserID,
	})
}

func (h *AppHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if h.UserService == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User service not configured"})
		return
	}

	loginReq := user.LoginRequest{Email: req.Email, Password: req.Password}
	tokenString, loggedIn, err := h.UserService.Login(c.Request.Context(), loginReq)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	// Block unverified users and resend verification link
	if !loggedIn.EmailVerified {
		go sendVerificationEmail(h, loggedIn.UserID, loggedIn.Email, loggedIn.FirstName)
		c.JSON(http.StatusForbidden, gin.H{
			"error":   "email_not_verified",
			"message": "Your email is not verified. A new verification link has been sent to your email.",
		})
		return
	}

	c.JSON(http.StatusOK, AuthResponse{
		Token: tokenString,
		User: struct {
			ID    string `json:"id"`
			Email string `json:"email"`
		}{
			ID:    loggedIn.UserID.String(),
			Email: loggedIn.Email,
		},
	})
}

func (h *AppHandler) Logout(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
		return
	}

	parts := strings.Fields(authHeader)
	if len(parts) < 2 || strings.ToLower(parts[0]) != "bearer" {
		c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
		return
	}

	tokenString := strings.TrimSpace(parts[1])
	
	// Blacklist for 24h
	if h.Cache != nil {
		slog.Info("Blacklisting token", "token_tail", tokenString[len(tokenString)-10:])
		if err := h.Cache.Set(context.Background(), "blacklist:"+tokenString, "true", 24*time.Hour); err != nil {
			slog.Warn("Failed to blacklist token", "error", err)
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}
