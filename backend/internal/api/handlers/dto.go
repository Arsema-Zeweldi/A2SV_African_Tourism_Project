package handlers

import (
	"github.com/google/uuid"
)

type RegisterRequest struct {
	Email     string `json:"email"      binding:"required,email"`
	Password  string `json:"password"   binding:"required,min=8"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

type LoginRequest struct {
	Email    string `json:"email"    binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type AuthResponse struct {
	Token string `json:"token"`
	User  struct {
		ID    string `json:"id"`
		Email string `json:"email"`
	} `json:"user"`
}

type PackageCreateRequest struct {
	ItineraryID uuid.UUID `json:"itinerary_id" binding:"required"`
	Title       string    `json:"title"        binding:"required,min=3,max=255"`
	Summary     string    `json:"summary"`
	Price       float64   `json:"price"        binding:"min=0"`
}

type PackageStatusRequest struct {
	Status string `json:"status" binding:"required,oneof=draft published archived"`
}

type PackageUpdateRequest struct {
	Title   *string  `json:"title"   binding:"omitempty,min=3,max=255"`
	Summary *string  `json:"summary" binding:"omitempty,max=2000"`
	Price   *float64 `json:"price"   binding:"omitempty,min=0"`
}

type ReviewRequest struct {
	Rating  int    `json:"rating"  binding:"required,min=1,max=5"`
	Comment string `json:"comment"`
}

type ChatRequest struct {
	Message string `json:"message" binding:"required,min=1,max=4096"`
}

type FeedQuery struct {
	SortBy   string `form:"sort_by"   binding:"omitempty,oneof=rating_avg price verified"`
	Order    string `form:"order"     binding:"omitempty,oneof=asc desc"`
	Page     int    `form:"page"      binding:"omitempty,min=1"`
	PageSize int    `form:"page_size" binding:"omitempty,min=1,max=100"`
}
