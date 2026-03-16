package handlers

import (
	"net/http"
	"time"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/config"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/service/ai_planner"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/service/discovery"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/service/intelligence"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AppHandler struct {
	DB             *gorm.DB
	Cfg            *config.Config
	PlannerService ai_planner.PlannerService
	SearchService  discovery.SearchService
	VisaService    intelligence.VisaService
	SafetyService  intelligence.SafetyService
}

func NewAppHandler(
	db *gorm.DB,
	cfg *config.Config,
	planner ai_planner.PlannerService,
	search discovery.SearchService,
	visa intelligence.VisaService,
	safety intelligence.SafetyService,
) *AppHandler {
	return &AppHandler{
		DB:             db,
		Cfg:            cfg,
		PlannerService: planner,
		SearchService:  search,
		VisaService:    visa,
		SafetyService:  safety,
	}
}

// IAM Handlers

func (h *AppHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 1. Hash password with PRD-required cost
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), 12)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// 2. Create user (explicitly default to traveler)
	user := models.User{
		UserID:       uuid.New(),
		Email:        req.Email,
		PasswordHash: string(hashedPassword),
		FirstName:    req.FirstName,
		LastName:     req.LastName,
		AccountType:  "traveler",
	}

	// 3. Save to database
	if err := h.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "User already exists or database error"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully", "user_id": user.UserID})
}

func (h *AppHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 1. Find user
	var user models.User
	if err := h.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// 2. Compare password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// 3. Generate JWT with explicit string types to avoid runtime panics, and include role
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.UserID.String(),
		"role":    user.AccountType,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(h.Cfg.JWTSecret))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, AuthResponse{
		Token: tokenString,
		User: struct {
			ID    string `json:"id"`
			Email string `json:"email"`
		}{
			ID:    user.UserID.String(),
			Email: user.Email,
		},
	})
}
