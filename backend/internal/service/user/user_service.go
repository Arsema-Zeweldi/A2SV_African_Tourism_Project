package user

import (
	"context"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/repository"
)

// Service is a placeholder implementation of UserService.
type Service struct {
	repo repository.UserRepository
}

func NewService(repo repository.UserRepository) *Service {
	return &Service{repo: repo}
}

func (s *Service) Register(ctx context.Context, req RegisterRequest) (*models.User, error) {
	return nil, repository.ErrNotImplemented
}

func (s *Service) Login(ctx context.Context, req LoginRequest) (string, *models.User, error) {
	return "", nil, repository.ErrNotImplemented
}

func (s *Service) GetPreferences(ctx context.Context, userID string) (*models.UserPreference, error) {
	return nil, repository.ErrNotImplemented
}

func (s *Service) UpdatePreferences(ctx context.Context, userID string, updates map[string]interface{}) (*models.UserPreference, error) {
	return nil, repository.ErrNotImplemented
}
