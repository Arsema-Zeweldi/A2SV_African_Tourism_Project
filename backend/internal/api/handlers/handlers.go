package handlers

import (
	"net/http"
	"time"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/config"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/database"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// IAM Handlers

func Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 1. Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// 2. Create user
	user := models.User{
		UserID:       uuid.New(),
		Email:        req.Email,
		PasswordHash: string(hashedPassword),
		FirstName:    req.FirstName,
		LastName:     req.LastName,
	}

	// 3. Save to database
	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "User already exists or database error"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully", "user_id": user.UserID})
}

func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 1. Find user
	var user models.User
	if err := database.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// 2. Compare password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// 3. Generate JWT
	cfg := config.LoadConfig() // In a real app, this should be injected or stored once
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.UserID,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(cfg.JWTSecret))
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
func GetUserPreferences(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Get preferences endpoint"})
}
func UpdateUserPreferences(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Update preferences endpoint"})
}

// Discovery Handlers
func ListRegions(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"message": "List regions endpoint"}) }
func SearchDestinations(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Search destinations endpoint"})
}
func GetDestinationDetails(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Get destination details endpoint"})
}

// AI Planner Handlers
func StartAIInterview(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Start AI interview endpoint"})
}
func SaveItinerary(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Save itinerary endpoint"})
}
func GetItinerary(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"message": "Get itinerary endpoint"}) }
func UpdateItineraryItem(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Update itinerary item endpoint"})
}

// Community & Marketplace Handlers
func ListPackages(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"message": "List packages endpoint"}) }
func PublishPackage(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Publish package endpoint"})
}
func ReviewPackage(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Review package endpoint"})
}
func GetPackageChat(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Get package chat endpoint"})
}

// Intelligence & Safety Handlers
func GetVisaRequirements(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Get visa requirements endpoint"})
}
func GetSafetyAlerts(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Get safety alerts endpoint"})
}
