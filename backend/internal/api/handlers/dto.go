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
	SortBy   string `form:"sort_by"   binding:"omitempty,oneof=rating_avg price verified views"`
	Order    string `form:"order"     binding:"omitempty,oneof=asc desc"`
	Page     int    `form:"page"      binding:"omitempty,min=1"`
	PageSize int    `form:"page_size" binding:"omitempty,min=1,max=100"`
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

type UpdateUserPreferencesRequest struct {
	TravelerType        *string   `json:"traveler_type" binding:"omitempty,oneof=solo couple family group"`
	PreferredSeason     *string   `json:"preferred_season" binding:"omitempty,oneof=spring summer autumn winter any"`
	BudgetRange         *string   `json:"budget_range" binding:"omitempty,oneof=low medium high luxury"`
	TripDuration        *string   `json:"trip_duration" binding:"omitempty,oneof=short medium long"`
	PreferredActivities *[]string `json:"preferred_activities"`
	DietaryRestrictions *[]string `json:"dietary_restrictions"`
	AccessibilityNeeds  *[]string `json:"accessibility_needs"`
}

type DestinationSearchQuery struct {
	Query      string `form:"q"`
	RegionID   string `form:"region_id"`
	CountryID  string `form:"country_id"`
	PriceLevel *int   `form:"price_level"`
	Season     string `form:"season"`
	Tags       string `form:"tags"`
	Page       int    `form:"page"`
	PageSize   int    `form:"page_size"`
}

type CreateDestinationRequest struct {
	Name             string  `json:"name" binding:"required,min=2,max=200"`
	Slug             string  `json:"slug" binding:"required,min=2,max=200"`
	Description      string  `json:"description"`
	ShortDescription string  `json:"short_description"`
	CountryID        string  `json:"country_id" binding:"required"`
	RegionID         string  `json:"region_id" binding:"required"`
	City             string  `json:"city"`
	Latitude         float64 `json:"latitude"`
	Longitude        float64 `json:"longitude"`
	DestinationType  string  `json:"destination_type"`
	HeroImageURL     string  `json:"hero_image_url"`
	AnnualVisitors   *int    `json:"annual_visitors"`
	BestSeason       string  `json:"best_season"`
	PriceLevel       *int    `json:"price_level"`
	IsUnescoSite     *bool   `json:"is_unesco_site"`
	IsActive         *bool   `json:"is_active"`
}

type UpdateDestinationRequest struct {
	Name             *string  `json:"name" binding:"omitempty,min=2,max=200"`
	Slug             *string  `json:"slug" binding:"omitempty,min=2,max=200"`
	Description      *string  `json:"description"`
	ShortDescription *string  `json:"short_description"`
	CountryID        *string  `json:"country_id"`
	RegionID         *string  `json:"region_id"`
	City             *string  `json:"city"`
	Latitude         *float64 `json:"latitude"`
	Longitude        *float64 `json:"longitude"`
	DestinationType  *string  `json:"destination_type"`
	HeroImageURL     *string  `json:"hero_image_url"`
	AnnualVisitors   *int     `json:"annual_visitors"`
	BestSeason       *string  `json:"best_season"`
	PriceLevel       *int     `json:"price_level"`
	IsUnescoSite     *bool    `json:"is_unesco_site"`
	IsActive         *bool    `json:"is_active"`
}

type StartAIInterviewRequest struct {
	SessionID  string            `json:"session_id"`
	PromptSeed string            `json:"prompt_seed"`
	Answers    map[string]string `json:"answers"`
}

type GeneratePlanRequest struct {
	Destination  string   `json:"destination" binding:"required"`
	DurationDays int      `json:"duration_days" binding:"required,min=1,max=30"`
	BudgetLevel  string   `json:"budget_level" binding:"omitempty,oneof=low medium luxury"`
	VibeTags     []string `json:"vibe_tags"`
	GroupSize    int      `json:"group_size" binding:"omitempty,min=1,max=50"`
	ClimatePref  string   `json:"climate_pref" binding:"omitempty,oneof=tropical desert coastal highland any"`
}

type CreateItineraryRequest struct {
	Title       string                `json:"title" binding:"required,min=3,max=255"`
	Description string                `json:"description"`
	StartDate   string                `json:"start_date"`
	EndDate     string                `json:"end_date"`
	Items       []CreateItineraryItem `json:"items"`
}

type CreateItineraryItem struct {
	DayNumber           int     `json:"day_number" binding:"required,min=1"`
	ActivityName        string  `json:"activity_name" binding:"required,min=2,max=255"`
	ActivityDescription string  `json:"activity_description"`
	DestinationID       string  `json:"destination_id"`
	CostEst             float64 `json:"cost_est"`
	Latitude            float64 `json:"latitude"`
	Longitude           float64 `json:"longitude"`
	StartTime           string  `json:"start_time"`
	EndTime             string  `json:"end_time"`
}

type UpdateItineraryItemRequest struct {
	ItemID              string   `json:"item_id" binding:"required"`
	ActivityName        *string  `json:"activity_name"`
	ActivityDescription *string  `json:"activity_description"`
	CostEst             *float64 `json:"cost_est"`
	StartTime           *string  `json:"start_time"`
	EndTime             *string  `json:"end_time"`
}

type VisaRequirementQuery struct {
	SourceCountryID      string `form:"source_country_id" binding:"required"`
	DestinationCountryID string `form:"destination_country_id" binding:"required"`
}

type SafetyAlertQuery struct {
	CountryID  string `form:"country_id"`
	MinLevel   *int   `form:"min_level"`
	MaxLevel   *int   `form:"max_level"`
	ActiveOnly *bool  `form:"active_only"`
}
