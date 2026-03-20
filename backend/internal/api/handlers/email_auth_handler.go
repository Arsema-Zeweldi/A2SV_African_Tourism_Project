package handlers

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/email"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/repository"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// VerifyEmail handles GET /auth/verify-email?token=xxx
func (h *AppHandler) VerifyEmail(c *gin.Context) {
	tokenStr := strings.TrimSpace(c.Query("token"))
	if tokenStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "token is required"})
		return
	}

	tokenRepo := repository.NewGormTokenRepository(h.DB)
	tok, err := tokenRepo.FindToken(c.Request.Context(), tokenStr, repository.TokenTypeEmailVerification)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or expired verification link"})
		return
	}

	// Mark user as verified
	if err := h.DB.WithContext(c.Request.Context()).
		Model(&struct{ EmailVerified bool }{}).
		Table("users").
		Where("user_id = ?", tok.UserID).
		Update("email_verified", true).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify email"})
		return
	}

	if err := tokenRepo.MarkUsed(c.Request.Context(), tok.TokenID); err != nil {
		slog.Warn("Failed to mark token used", "error", err)
	}

	// Send welcome email async
	if h.Cfg != nil {
		go func() {
			var firstName string
			h.DB.WithContext(context.Background()).Raw("SELECT first_name FROM users WHERE user_id = ?", tok.UserID).Scan(&firstName)
			svc := email.NewService(h.Cfg.BrevoAPIURL, h.Cfg.BrevoAPIKey, h.Cfg.EmailFrom, h.Cfg.EmailFromName)
			var userEmail string
			h.DB.WithContext(context.Background()).Raw("SELECT email FROM users WHERE user_id = ?", tok.UserID).Scan(&userEmail)
			if err := svc.SendWelcomeEmail(userEmail, firstName, h.Cfg.FrontendURL); err != nil {
				slog.Warn("Failed to send welcome email", "error", err)
			}
		}()
	}

	// Redirect to frontend login page
	frontendURL := "http://localhost:3000"
	if h.Cfg != nil && h.Cfg.FrontendURL != "" {
		frontendURL = h.Cfg.FrontendURL
	}
	c.Redirect(http.StatusFound, frontendURL+"/login?verified=true")
}

// ResendVerification handles POST /auth/resend-verification
func (h *AppHandler) ResendVerification(c *gin.Context) {
	var req struct {
		Email string `json:"email" binding:"required,email"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.UserService.GetUserByEmail(c.Request.Context(), req.Email)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User with this email does not exist"})
		return
	}
	if user.EmailVerified {
		c.JSON(http.StatusOK, gin.H{"message": "Email is already verified"})
		return
	}

	go sendVerificationEmail(h, user.UserID, user.Email, user.FirstName)
	c.JSON(http.StatusOK, gin.H{"message": "Verification email sent"})
}

// ForgotPassword handles POST /auth/forgot-password
func (h *AppHandler) ForgotPassword(c *gin.Context) {
	var req struct {
		Email string `json:"email" binding:"required,email"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.UserService.GetUserByEmail(c.Request.Context(), req.Email)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User with this email does not exist"})
		return
	}

	go func() {
		tokenRepo := repository.NewGormTokenRepository(h.DB)
		tok, err := tokenRepo.CreateToken(context.Background(), user.UserID, repository.TokenTypePasswordReset, 15*time.Minute)
		if err != nil {
			slog.Warn("Failed to create reset token", "error", err)
			return
		}
		frontendURL := "http://localhost:3000"
		if h.Cfg != nil && h.Cfg.FrontendURL != "" {
			frontendURL = h.Cfg.FrontendURL
		}
		resetURL := fmt.Sprintf("%s/reset-password?token=%s", frontendURL, tok.Token)
		svc := email.NewService(h.Cfg.BrevoAPIURL, h.Cfg.BrevoAPIKey, h.Cfg.EmailFrom, h.Cfg.EmailFromName)
		if err := svc.SendPasswordResetEmail(user.Email, user.FirstName, resetURL); err != nil {
			slog.Warn("Failed to send password reset email", "error", err)
		}
	}()

	c.JSON(http.StatusOK, gin.H{"message": "A reset link has been sent to your email"})
}

// ResetPassword handles POST /auth/reset-password
func (h *AppHandler) ResetPassword(c *gin.Context) {
	var req struct {
		Token           string `json:"token"            binding:"required"`
		Password        string `json:"password"         binding:"required,min=8"`
		PasswordConfirm string `json:"password_confirm" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if req.Password != req.PasswordConfirm {
		c.JSON(http.StatusBadRequest, gin.H{"error": "passwords do not match"})
		return
	}

	tokenRepo := repository.NewGormTokenRepository(h.DB)
	tok, err := tokenRepo.FindToken(c.Request.Context(), req.Token, repository.TokenTypePasswordReset)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or expired reset link"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), 12)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	if err := h.DB.WithContext(c.Request.Context()).
		Table("users").
		Where("user_id = ?", tok.UserID).
		Update("password_hash", string(hashedPassword)).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reset password"})
		return
	}

	if err := tokenRepo.MarkUsed(c.Request.Context(), tok.TokenID); err != nil {
		slog.Warn("Failed to mark token used", "error", err)
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password reset successfully. You can now log in."})
}

// ChangePassword handles POST /user/change-password (authenticated)
func (h *AppHandler) ChangePassword(c *gin.Context) {
	userID, err := getUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var req struct {
		CurrentPassword string `json:"current_password" binding:"required"`
		NewPassword     string `json:"new_password"     binding:"required,min=8"`
		PasswordConfirm string `json:"password_confirm" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if req.NewPassword != req.PasswordConfirm {
		c.JSON(http.StatusBadRequest, gin.H{"error": "new passwords do not match"})
		return
	}

	// Fetch current hash
	var passwordHash string
	if err := h.DB.WithContext(c.Request.Context()).
		Raw("SELECT password_hash FROM users WHERE user_id = ?", userID).
		Scan(&passwordHash).Error; err != nil || passwordHash == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.CurrentPassword)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Current password is incorrect"})
		return
	}

	newHash, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), 12)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	if err := h.DB.WithContext(c.Request.Context()).
		Table("users").
		Where("user_id = ?", userID).
		Update("password_hash", string(newHash)).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to change password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password changed successfully"})
}

// sendVerificationEmail is a reusable helper
func sendVerificationEmail(h *AppHandler, userID uuid.UUID, userEmail, firstName string) {
	if h.DB == nil || h.Cfg == nil {
		return
	}
	tokenRepo := repository.NewGormTokenRepository(h.DB)
	tok, err := tokenRepo.CreateToken(context.Background(), userID, repository.TokenTypeEmailVerification, 24*time.Hour)
	if err != nil {
		slog.Warn("Failed to create verification token", "error", err)
		return
	}
	backendURL := "http://localhost:8080"
	if h.Cfg.FrontendURL != "" {
		// Use backend URL for verification endpoint
		backendURL = "http://localhost:8080"
	}
	verifyURL := fmt.Sprintf("%s/api/v1/auth/verify-email?token=%s", backendURL, tok.Token)
	svc := email.NewService(h.Cfg.BrevoAPIURL, h.Cfg.BrevoAPIKey, h.Cfg.EmailFrom, h.Cfg.EmailFromName)
	if err := svc.SendVerificationEmail(userEmail, firstName, verifyURL); err != nil {
		slog.Warn("Failed to send verification email", "error", err)
	}
}

// UpdateProfile endpoint update to handle no-field case gracefully
func ignoreEmptyString(s *string) bool {
	return s == nil || strings.TrimSpace(*s) == ""
}

// helper for DB updates that use raw pointer
func strPtr(s string) *string { return &s }

// DBUpdateEmailVerified — utility used in tests only
func DBUpdateEmailVerified(db *gorm.DB, userID uuid.UUID, val bool) error {
	return db.Table("users").Where("user_id = ?", userID).Update("email_verified", val).Error
}
