package user

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/repository"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// Service is a placeholder implementation of UserService.
type Service struct {
	repo      repository.UserRepository
	jwtSecret string
	jwtTTL    time.Duration
}

func NewService(repo repository.UserRepository, jwtSecret string) *Service {
	return &Service{repo: repo, jwtSecret: jwtSecret, jwtTTL: 24 * time.Hour}
}

func (s *Service) Register(ctx context.Context, req RegisterRequest) (*models.User, error) {
	req.Email = strings.TrimSpace(req.Email)
	req.FirstName = strings.TrimSpace(req.FirstName)
	req.LastName = strings.TrimSpace(req.LastName)
	if req.Email == "" || req.Password == "" {
		return nil, errors.New("email and password are required")
	}
	_, err := s.repo.FindByEmail(ctx, req.Email)
	if err == nil {
		return nil, errors.New("user already exists")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), 12)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Email:        req.Email,
		PasswordHash: string(hashedPassword),
		FirstName:    req.FirstName,
		LastName:     req.LastName,
	}
	if err := s.repo.Create(ctx, user); err != nil {
		return nil, err
	}
	return user, nil
}

func (s *Service) Login(ctx context.Context, req LoginRequest) (string, *models.User, error) {
	if req.Email == "" || req.Password == "" {
		return "", nil, errors.New("email and password are required")
	}
	user, err := s.repo.FindByEmail(ctx, req.Email)
	if err != nil {
		return "", nil, errors.New("invalid email or password")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return "", nil, errors.New("invalid email or password")
	}
	if s.jwtSecret == "" {
		return "", nil, errors.New("jwt secret not configured")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.UserID.String(),
		"role":    "traveler",
		"exp":     time.Now().Add(s.jwtTTL).Unix(),
	})
	tokenString, err := token.SignedString([]byte(s.jwtSecret))
	if err != nil {
		return "", nil, err
	}

	return tokenString, user, nil
}

func (s *Service) GetPreferences(ctx context.Context, userID string) (*models.UserPreference, error) {
	userID = strings.TrimSpace(userID)
	if userID == "" {
		return nil, errors.New("user_id is required")
	}
	uid, err := parseUUID(userID)
	if err != nil {
		return nil, err
	}
	return s.repo.GetPreferences(ctx, uid)
}

func (s *Service) UpdatePreferences(ctx context.Context, userID string, updates map[string]interface{}) (*models.UserPreference, error) {
	userID = strings.TrimSpace(userID)
	if userID == "" {
		return nil, errors.New("user_id is required")
	}
	if len(updates) == 0 {
		return nil, errors.New("no updates provided")
	}
	uid, err := parseUUID(userID)
	if err != nil {
		return nil, err
	}
	return s.repo.UpsertPreferences(ctx, uid, updates)
}

func (s *Service) GetProfile(ctx context.Context, userID string) (*models.User, error) {
	uid, err := parseUUID(userID)
	if err != nil {
		return nil, err
	}
	return s.repo.FindByID(ctx, uid)
}

func (s *Service) UpdateProfile(ctx context.Context, userID string, updates map[string]interface{}) (*models.User, error) {
	uid, err := parseUUID(userID)
	if err != nil {
		return nil, err
	}
	return s.repo.Update(ctx, uid, updates)
}

func parseUUID(raw string) (uuid.UUID, error) {
	return uuid.Parse(raw)
}
