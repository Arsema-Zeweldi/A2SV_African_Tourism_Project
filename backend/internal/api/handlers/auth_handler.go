package handlers

import (
	"net/http"
	"strings"

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
}

func NewAppHandler(
	db *gorm.DB,
	cfg *config.Config,
	planner ai_planner.PlannerService,
	userSvc user.UserService,
	itinerarySvc itinerary.ItineraryService,
	communitySvc community.CommunityService,
	uploadSvc upload.UploadService,
) *AppHandler {
	return &AppHandler{
		DB:             db,
		Cfg:            cfg,
		PlannerService: planner,
		UserService:    userSvc,
		ItinerarySvc:   itinerarySvc,
		CommunitySvc:   communitySvc,
		UploadSvc:      uploadSvc,
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

	// 2. Create user (explicitly default to traveler)
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

	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully", "user_id": created.UserID})
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
