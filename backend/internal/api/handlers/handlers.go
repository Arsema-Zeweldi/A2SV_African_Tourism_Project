package handlers

import (
	"net/http"
	"strings"
	"time"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/config"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AppHandler struct {
	DB  *gorm.DB
	Cfg *config.Config
}

func NewAppHandler(db *gorm.DB, cfg *config.Config) *AppHandler {
	return &AppHandler{DB: db, Cfg: cfg}
}

// IAM Handlers

func (h *AppHandler) Register(c *gin.Context) {
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

	// 3. Generate JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.UserID,
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
func (h *AppHandler) GetUserPreferences(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Get preferences endpoint"})
}
func (h *AppHandler) UpdateUserPreferences(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Update preferences endpoint"})
}

type CreateRegionRequest struct {
	Name        string `json:"name" binding:"required,min=2,max=150"`
	Slug        string `json:"slug" binding:"required,min=2,max=150"`
	Description string `json:"description"`
}

type UpdateRegionRequest struct {
	Name        *string `json:"name" binding:"omitempty,min=2,max=150"`
	Slug        *string `json:"slug" binding:"omitempty,min=2,max=150"`
	Description *string `json:"description"`
}

func (h *AppHandler) ListRegions(c *gin.Context) {
	var regions []models.Region
	if err := h.DB.Order("name ASC").Find(&regions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch regions"})
		return
	}
	c.JSON(http.StatusOK, regions)
}

func (h *AppHandler) CreateRegion(c *gin.Context) {
	var req CreateRegionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	region := models.Region{
		RegionID:    uuid.New(),
		Name:        strings.TrimSpace(req.Name),
		Slug:        strings.TrimSpace(req.Slug),
		Description: strings.TrimSpace(req.Description),
	}

	if err := h.DB.Create(&region).Error; err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Failed to create region"})
		return
	}

	c.JSON(http.StatusCreated, region)
}

func (h *AppHandler) GetRegion(c *gin.Context) {
	regionID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid region ID"})
		return
	}

	var region models.Region
	if err := h.DB.First(&region, "region_id = ?", regionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Region not found"})
		return
	}

	c.JSON(http.StatusOK, region)
}

func (h *AppHandler) UpdateRegion(c *gin.Context) {
	regionID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid region ID"})
		return
	}

	var req UpdateRegionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updates := map[string]interface{}{}
	if req.Name != nil {
		updates["name"] = strings.TrimSpace(*req.Name)
	}
	if req.Slug != nil {
		updates["slug"] = strings.TrimSpace(*req.Slug)
	}
	if req.Description != nil {
		updates["description"] = strings.TrimSpace(*req.Description)
	}

	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No fields provided to update"})
		return
	}

	res := h.DB.Model(&models.Region{}).Where("region_id = ?", regionID).Updates(updates)
	if res.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update region"})
		return
	}
	if res.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Region not found"})
		return
	}

	h.GetRegion(c)
}

func (h *AppHandler) DeleteRegion(c *gin.Context) {
	regionID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid region ID"})
		return
	}

	res := h.DB.Delete(&models.Region{}, "region_id = ?", regionID)
	if res.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete region"})
		return
	}
	if res.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Region not found"})
		return
	}

	c.Status(http.StatusNoContent)
}

// Discovery Handlers
func (h *AppHandler) SearchDestinations(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Search destinations endpoint"})
}
func (h *AppHandler) GetDestinationDetails(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Get destination details endpoint"})
}

// AI Planner Handlers
func (h *AppHandler) StartAIInterview(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Start AI interview endpoint"})
}
func (h *AppHandler) SaveItinerary(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Save itinerary endpoint"})
}
func (h *AppHandler) GetItinerary(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Get itinerary endpoint"})
}
func (h *AppHandler) UpdateItineraryItem(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Update itinerary item endpoint"})
}

// Note: Package/Marketplace handlers are implemented in PackagesHandler (packages_handler.go).

// Intelligence & Safety Handlers
func (h *AppHandler) GetVisaRequirements(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Get visa requirements endpoint"})
}
func (h *AppHandler) GetSafetyAlerts(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Get safety alerts endpoint"})
}
