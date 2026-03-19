package handlers

import (
	"github.com/google/uuid"
)

type RegisterRequest struct {
	Email     string `json:"email"      binding:"required,email"`
	Password  string `json:"password"   binding:"required,min=8"`
	Name      string `json:"name"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Terms     bool   `json:"terms"`
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
	ItineraryID  uuid.UUID `json:"itinerary_id" form:"itinerary_id" binding:"required"`
	Title        string    `json:"title"        form:"title"        binding:"required,min=3,max=255"`
	Summary      string    `json:"summary"      form:"summary"`
	Description  string    `json:"description"  form:"description"`
	Price        float64   `json:"price"        form:"price"        binding:"min=0"`
	Country      string    `json:"country"      form:"country"`
	Location     string    `json:"location"     form:"location"`
	Currency     string    `json:"currency"     form:"currency"`
	ImageURL     string    `json:"image_url"    form:"image_url"`
	DurationDays int       `json:"duration_days" form:"duration_days" binding:"min=0"`
	Category     string    `json:"category"     form:"category"`
	GroupSize    string    `json:"group_size"    form:"group_size"`
	IsPublic     *bool     `json:"is_public"     form:"is_public"`
}

type PackageStatusRequest struct {
	Status string `json:"status" binding:"required,oneof=private public archived"`
}

type PackageUpdateRequest struct {
	Title        *string  `json:"title"         form:"title"         binding:"omitempty,min=3,max=255"`
	Summary      *string  `json:"summary"       form:"summary"       binding:"omitempty,max=2000"`
	Description  *string  `json:"description"   form:"description"   binding:"omitempty,max=5000"`
	Price        *float64 `json:"price"         form:"price"         binding:"omitempty,min=0"`
	Country      *string  `json:"country"       form:"country"`
	Location     *string  `json:"location"      form:"location"`
	Currency     *string  `json:"currency"      form:"currency"`
	ImageURL     *string  `json:"image_url"     form:"image_url"`
	DurationDays *int     `json:"duration_days" form:"duration_days" binding:"omitempty,min=0"`
	Category     *string  `json:"category"      form:"category"`
	GroupSize    *string  `json:"group_size"     form:"group_size"`
	IsPublic     *bool    `json:"is_public"      form:"is_public"`
}

type ReviewRequest struct {
	Rating  int    `json:"rating"  binding:"required,min=1,max=5"`
	Comment string `json:"comment"`
}

type ChatRequest struct {
	Message string `json:"message" binding:"required,min=1,max=4096"`
}

type FeedQuery struct {
	Query    string `form:"q"`
	SortBy   string `form:"sort_by"   binding:"omitempty,oneof=rating_avg price verified views"`
	Order    string `form:"order"     binding:"omitempty,oneof=asc desc"`
	Page     int    `form:"page"      binding:"omitempty,min=1"`
	PageSize int    `form:"page_size" binding:"omitempty,min=1,max=100"`
}

type CountryQuery struct {
	Query    string `form:"q"`
	ISOCode  string `form:"iso_code"`
	Page     int    `form:"page"      binding:"omitempty,min=1"`
	PageSize int    `form:"page_size" binding:"omitempty,min=1,max=200"`
}

type CreateCountryRequest struct {
	Name         string `json:"name" binding:"required,min=2,max=150"`
	ISOCode      string `json:"iso_code" binding:"required,len=2"`
	Capital      string `json:"capital"`
	CurrencyCode string `json:"currency_code"`
}

type UpdateCountryRequest struct {
	Name         *string `json:"name" binding:"omitempty,min=2,max=150"`
	ISOCode      *string `json:"iso_code" binding:"omitempty,len=2"`
	Capital      *string `json:"capital"`
	CurrencyCode *string `json:"currency_code"`
}

type UpdateUserPreferencesRequest struct {
	PreferredSeason     *string   `json:"preferred_season" binding:"omitempty,oneof=spring summer autumn winter any"`
	BudgetRange         *string   `json:"budget_range" binding:"omitempty,oneof=low medium high luxury"`
	PreferredActivities *[]string `json:"preferred_activities"`
	DietaryRestrictions *[]string `json:"dietary_restrictions"`
	PreferredClimate    *string   `json:"preferred_climate" binding:"omitempty,oneof=tropical desert coastal highland temperate any"`
	PreferredLanguage   *string   `json:"preferred_language" binding:"omitempty,oneof=english french arabic portuguese swahili any"`
	TravelVibeInterest  *string   `json:"travel_vibe_interest" binding:"omitempty,oneof=adventure relaxed foodie history party culture wildlife any"`
	TravelVibes         *[]string `json:"travel_vibes"`
}

type StartAIInterviewRequest struct {
	SessionID  string            `json:"session_id"`
	PromptSeed string            `json:"prompt_seed"`
	Answers    map[string]string `json:"answers"`
}

type GeneratePlanRequest struct {
	Destination  string   `json:"destination" binding:"required"`
	DurationDays int      `json:"duration_days" binding:"required,min=1,max=30"`
	Budget       float64  `json:"budget" binding:"omitempty,min=0"`
	BudgetLevel  string   `json:"budget_level" binding:"omitempty,oneof=low medium high luxury"`
	VibeTags     []string `json:"vibe_tags"`
	GroupSize    int      `json:"group_size" binding:"omitempty,min=1,max=50"`
	ClimatePref  string   `json:"climate_pref" binding:"omitempty,oneof=tropical desert coastal highland temperate any"`
	MultiCountry *bool    `json:"multi_country"`
	Notes        string   `json:"notes"`
}

type CreateItineraryRequest struct {
	Title       string                `json:"title" binding:"required,min=3,max=255"`
	Description string                `json:"description"`
	DaysCount   int                   `json:"days_count" binding:"omitempty,min=0"`
	NightsCount int                   `json:"nights_count" binding:"omitempty,min=0"`
	StartDate   string                `json:"start_date"`
	EndDate     string                `json:"end_date"`
	Activities  []CreateItineraryActivity `json:"activities"`
}

type CreateItineraryActivity struct {
	DayNumber     int     `json:"day_number" binding:"required,min=1"`
	OrderIndex    int     `json:"order_index" binding:"omitempty,min=0"`
	Title         string  `json:"title" binding:"required,min=2,max=255"`
	Description   string  `json:"description"`
	TimeLabel     string  `json:"time_label"`
	DurationLabel string  `json:"duration_label"`
	CostLabel     string  `json:"cost_label"`
	Location      string  `json:"location"`
	ActivityType  string  `json:"activity_type"`
	ImageURL      string  `json:"image_url"`
	AIPick        bool    `json:"ai_pick"`
	Requirement   string  `json:"requirement"`
	Latitude      float64 `json:"latitude"`
	Longitude     float64 `json:"longitude"`
	StartTime     string  `json:"start_time"`
	EndTime       string  `json:"end_time"`
}

type UpdateItineraryActivityRequest struct {
	ActivityID    string   `json:"activity_id" binding:"required"`
	DayNumber     *int     `json:"day_number"`
	OrderIndex    *int     `json:"order_index"`
	Title         *string  `json:"title"`
	Description   *string  `json:"description"`
	TimeLabel     *string  `json:"time_label"`
	DurationLabel *string  `json:"duration_label"`
	CostLabel     *string  `json:"cost_label"`
	Location      *string  `json:"location"`
	ActivityType  *string  `json:"activity_type"`
	ImageURL      *string  `json:"image_url"`
	AIPick        *bool    `json:"ai_pick"`
	Requirement   *string  `json:"requirement"`
	Latitude      *float64 `json:"latitude"`
	Longitude     *float64 `json:"longitude"`
	StartTime     *string  `json:"start_time"`
	EndTime       *string  `json:"end_time"`
}

// ✅ Community DTOs
type CreatePostRequest struct {
	Content     string `json:"content"      form:"content"      binding:"required"`
	MediaURL    string `json:"media_url"     form:"media_url"`
	MediaType   string `json:"media_type"    form:"media_type"`
	Location    string `json:"location"      form:"location"`
	PackageName string `json:"package_name"  form:"package_name"`
}

type PostResponse struct {
	PostID        uuid.UUID `json:"post_id"`
	UserID        uuid.UUID `json:"user_id"`
	UserName      string    `json:"user_name"`
	UserAvatar    string    `json:"user_avatar"`
	Content       string    `json:"content"`
	MediaURL      string    `json:"media_url"`
	MediaType     string    `json:"media_type"`
	Location      string    `json:"location"`
	PackageName   string    `json:"package_name"`
	LikesCount    int       `json:"likes_count"`
	CommentsCount int       `json:"comments_count"`
	CreatedAt     string    `json:"created_at"`
	Status        string    `json:"status"`
}

type CreateCommentRequest struct {
	Text string `json:"text" binding:"required,min=1"`
}

type CommentResponse struct {
	CommentID uuid.UUID `json:"comment_id"`
	PostID    uuid.UUID `json:"post_id"`
	UserID    uuid.UUID `json:"user_id"`
	UserName  string    `json:"user_name"`
	UserAvatar string    `json:"user_avatar"`
	Text      string    `json:"text"`
	CreatedAt string    `json:"created_at"`
}

type UpdateProfileRequest struct {
	FirstName       *string `json:"first_name"         form:"first_name"         binding:"omitempty,max=100"`
	LastName        *string `json:"last_name"          form:"last_name"          binding:"omitempty,max=100"`
	Country         *string `json:"country"            form:"country"            binding:"omitempty,max=100"`
	Bio             *string `json:"bio"                form:"bio"                binding:"omitempty,max=1000"`
	ProfileImageURL *string `json:"profile_image_url"  form:"profile_image_url"  binding:"omitempty,url"`
}

type UserProfileResponse struct {
	UserID          uuid.UUID `json:"user_id"`
	Email           string    `json:"email"`
	FirstName       string    `json:"first_name"`
	LastName        string    `json:"last_name"`
	Country         string    `json:"country"`
	Bio             string    `json:"bio"`
	ProfileImageURL string    `json:"profile_image_url"`
	CreatedAt       string    `json:"created_at"`
}
