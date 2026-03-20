package user

import (
	"context"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
)

// UserService defines user-related operations.
type UserService interface {
	Register(ctx context.Context, req RegisterRequest) (*models.User, error)
	Login(ctx context.Context, req LoginRequest) (string, *models.User, error)
	GetPreferences(ctx context.Context, userID string) (*models.UserPreference, error)
	UpdatePreferences(ctx context.Context, userID string, updates map[string]interface{}) (*models.UserPreference, error)
	GetProfile(ctx context.Context, userID string) (*models.User, error)
	UpdateProfile(ctx context.Context, userID string, updates map[string]interface{}) (*models.User, error)
	GetUserByEmail(ctx context.Context, email string) (*models.User, error)
}

// RegisterRequest is a placeholder for service-level registration inputs.
type RegisterRequest struct {
	Email     string
	Password  string
	FirstName string
	LastName  string
}

// LoginRequest is a placeholder for service-level login inputs.
type LoginRequest struct {
	Email    string
	Password string
}
