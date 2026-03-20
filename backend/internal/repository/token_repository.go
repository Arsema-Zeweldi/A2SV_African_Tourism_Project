package repository

import (
	"context"
	"time"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

const (
	TokenTypeEmailVerification = "email_verification"
	TokenTypePasswordReset     = "password_reset"
)

// TokenRepository provides access to auth token storage.
type TokenRepository interface {
	CreateToken(ctx context.Context, userID uuid.UUID, tokenType string, ttl time.Duration) (*models.AuthToken, error)
	FindToken(ctx context.Context, token, tokenType string) (*models.AuthToken, error)
	MarkUsed(ctx context.Context, tokenID uuid.UUID) error
	DeleteUserTokens(ctx context.Context, userID uuid.UUID, tokenType string) error
}

type GormTokenRepository struct {
	db *gorm.DB
}

func NewGormTokenRepository(db *gorm.DB) *GormTokenRepository {
	return &GormTokenRepository{db: db}
}

func (r *GormTokenRepository) CreateToken(ctx context.Context, userID uuid.UUID, tokenType string, ttl time.Duration) (*models.AuthToken, error) {
	// Invalidate previous unused tokens of the same type
	r.db.WithContext(ctx).
		Where("user_id = ? AND token_type = ? AND used = false", userID, tokenType).
		Delete(&models.AuthToken{})

	tok := &models.AuthToken{
		UserID:    userID,
		Token:     uuid.New().String(), // random UUID as token
		TokenType: tokenType,
		Used:      false,
		ExpiresAt: time.Now().Add(ttl),
	}
	if err := r.db.WithContext(ctx).Create(tok).Error; err != nil {
		return nil, err
	}
	return tok, nil
}

func (r *GormTokenRepository) FindToken(ctx context.Context, token, tokenType string) (*models.AuthToken, error) {
	var tok models.AuthToken
	if err := r.db.WithContext(ctx).
		Where("token = ? AND token_type = ? AND used = false AND expires_at > NOW()", token, tokenType).
		First(&tok).Error; err != nil {
		return nil, err
	}
	return &tok, nil
}

func (r *GormTokenRepository) MarkUsed(ctx context.Context, tokenID uuid.UUID) error {
	return r.db.WithContext(ctx).
		Model(&models.AuthToken{}).
		Where("token_id = ?", tokenID).
		Update("used", true).Error
}

func (r *GormTokenRepository) DeleteUserTokens(ctx context.Context, userID uuid.UUID, tokenType string) error {
	return r.db.WithContext(ctx).
		Where("user_id = ? AND token_type = ?", userID, tokenType).
		Delete(&models.AuthToken{}).Error
}
