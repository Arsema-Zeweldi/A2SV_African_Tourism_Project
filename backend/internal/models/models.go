package models

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

// ✅ User & IAM
type User struct {
	UserID          uuid.UUID      `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"user_id"`
	Email           string         `gorm:"size:255;unique;not null" json:"email"`
	PasswordHash    string         `gorm:"size:255;not null" json:"-"`
	FirstName       string         `gorm:"size:100;index" json:"first_name"`
	LastName        string         `gorm:"size:100;index" json:"last_name"`
	Country         string         `gorm:"size:100" json:"country"`
	Bio             string         `gorm:"text" json:"bio"`
	AvatarURL       string         `gorm:"text" json:"avatar_url"`
	EmailVerified   bool           `gorm:"default:false" json:"email_verified"`
	IsActive        bool           `gorm:"default:true" json:"is_active"`
	CreatedAt       time.Time      `gorm:"not null;default:now()" json:"created_at"`
	UpdatedAt       time.Time      `gorm:"not null;default:now()" json:"updated_at"`
	LastLoginAt     *time.Time     `json:"last_login_at"`
	Preferences     UserPreference `gorm:"foreignKey:UserID" json:"preferences"`
}

type UserPreference struct {
	PreferenceID        uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"preference_id"`
	UserID              uuid.UUID `gorm:"type:uuid;not null" json:"user_id"`
	PreferredSeason     *string    `gorm:"type:preferred_season_enum" json:"preferred_season"`
	BudgetRange         *string    `gorm:"type:budget_range_enum" json:"budget_range"`
	PreferredActivities json.RawMessage `gorm:"type:jsonb" json:"preferred_activities"`
	DietaryRestrictions json.RawMessage `gorm:"type:jsonb" json:"dietary_restrictions"`
	PreferredClimate    *string    `gorm:"type:preferred_climate_enum" json:"preferred_climate"`
	PreferredLanguage   *string    `gorm:"type:preferred_language_enum" json:"preferred_language"`
	TravelVibeInterest  *string    `gorm:"type:travel_vibe_interest_enum" json:"travel_vibe_interest"`
	CreatedAt           time.Time `gorm:"not null;default:now()" json:"created_at"`
	UpdatedAt           time.Time `gorm:"not null;default:now()" json:"updated_at"`
}

// ✅ Geography & Discovery
type Country struct {
	CountryID    uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"country_id"`
	Name         string    `gorm:"size:150;not null" json:"name"`
	ISOCode      string    `gorm:"type:char(2);unique;not null" json:"iso_code"`
	Capital      string    `gorm:"size:150" json:"capital"`
	CurrencyCode string    `gorm:"size:10" json:"currency_code"`
}

// ✅ Itineraries
type Itinerary struct {
	ItineraryID   uuid.UUID       `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"itinerary_id"`
	UserID        uuid.UUID       `gorm:"type:uuid;not null" json:"user_id"`
	Title         string          `gorm:"size:255;not null" json:"title"`
	Description   string          `gorm:"text" json:"description"`
	DaysCount     int             `gorm:"default:0" json:"days_count"`
	NightsCount   int             `gorm:"default:0" json:"nights_count"`
	StartDate     *time.Time      `json:"start_date"`
	EndDate       *time.Time      `json:"end_date"`
	TotalCostEst  float64             `gorm:"type:decimal(12,2)" json:"total_cost_est"`
	CreatedAt     time.Time           `gorm:"default:now()" json:"created_at"`
	UpdatedAt     time.Time           `gorm:"default:now()" json:"updated_at"`
	Activities    []ItineraryActivity `gorm:"foreignKey:ItineraryID" json:"activities"`
}

// ActivityType represents the type of activity in an itinerary item (PRD spec)
type ActivityType = string

const (
    ActivityFood      ActivityType = "food"
    ActivityAdventure ActivityType = "adventure"
    ActivityCulture   ActivityType = "culture"
    ActivityParty     ActivityType = "party"
    ActivityWildlife  ActivityType = "wildlife"
)


type ItineraryActivity struct {
	ActivityID          uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"activity_id"`
	ItineraryID         uuid.UUID  `gorm:"type:uuid;not null" json:"itinerary_id"`
	DayNumber           int        `gorm:"not null" json:"day_number"`
	OrderIndex          int        `gorm:"default:0" json:"order_index"`
	Title               string     `gorm:"size:255;not null" json:"title"`
	Description         string     `gorm:"text" json:"description"`
	TimeLabel           string     `gorm:"size:50" json:"time_label"`
	DurationLabel       string     `gorm:"size:50" json:"duration_label"`
	CostLabel           string     `gorm:"size:50" json:"cost_label"`
	Location            string     `gorm:"size:255" json:"location"`
	ActivityType        string     `gorm:"size:50" json:"activity_type"`
	ImageURL            string     `gorm:"text" json:"image_url"`
	AIPick              bool       `gorm:"column:ai_pick;default:false" json:"ai_pick"`
	Requirement         string     `gorm:"text" json:"requirement"`
	Latitude            float64    `gorm:"type:decimal(10,7)" json:"latitude"`
	Longitude           float64    `gorm:"type:decimal(10,7)" json:"longitude"`
	StartTime           *string    `gorm:"type:time" json:"start_time"`
	EndTime             *string    `gorm:"type:time" json:"end_time"`
}

// ✅ Community Packages
type Package struct {
	PackageID           uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"package_id"`
	CreatorID           uuid.UUID `gorm:"type:uuid;not null" json:"creator_id"`
	ItineraryID         uuid.UUID `gorm:"type:uuid;not null" json:"itinerary_id"`
	Title               string    `gorm:"size:255;not null" json:"title"`
	Summary             string    `gorm:"text" json:"summary"`
	Description         string    `gorm:"text" json:"description"`
	Price               float64   `gorm:"type:decimal(10,2);default:0;index" json:"price"`
	Status              string    `gorm:"type:package_status_enum;default:'private';index" json:"status"`
	RatingAvg           float64   `gorm:"type:decimal(3,2);default:0;index" json:"rating_avg"`
	ReviewsCount        int       `gorm:"default:0;index" json:"reviews_count"`
	ViewsCount          int       `gorm:"default:0;index" json:"views_count"`
	Country             string    `gorm:"size:150" json:"country"`
	Location            string    `gorm:"size:255" json:"location"`
	Currency            string    `gorm:"size:10;default:'USD'" json:"currency"`
	ImageURL            string    `gorm:"text" json:"image_url"`
	DurationDays        int       `gorm:"default:0" json:"duration_days"`
	Category            string    `gorm:"size:100" json:"category"`
	GroupSize           string    `gorm:"size:50" json:"group_size"`
	CreatedAt           time.Time `gorm:"default:now()" json:"created_at"`
	UpdatedAt           time.Time `gorm:"default:now()" json:"updated_at"`

	Itinerary *Itinerary `gorm:"foreignKey:ItineraryID;references:ItineraryID" json:"itinerary,omitempty"`
}

type PackageReview struct {
	ReviewID  uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"review_id"`
	PackageID uuid.UUID `gorm:"type:uuid;not null" json:"package_id"`
	UserID    uuid.UUID `gorm:"type:uuid;not null" json:"user_id"`
	Rating    float64   `gorm:"type:numeric(2,1);check:rating >= 1 AND rating <= 5" json:"rating"`
	Comment   string    `gorm:"text" json:"comment"`
	CreatedAt time.Time `gorm:"default:now()" json:"created_at"`
}

type PackageChat struct {
	ChatID    uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"chat_id"`
	PackageID uuid.UUID `gorm:"type:uuid;not null" json:"package_id"`
	UserID    uuid.UUID `gorm:"type:uuid;not null" json:"user_id"`
	Message   string    `gorm:"text;not null" json:"message"`
	CreatedAt time.Time `gorm:"default:now()" json:"created_at"`
}

// ✅ Community Feed
type CommunityPost struct {
	PostID        uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"post_id"`
	UserID        uuid.UUID `gorm:"type:uuid;not null" json:"user_id"`
	Content       string    `gorm:"text;not null" json:"content"`
	MediaURL      string    `gorm:"text" json:"media_url"`
	MediaType     string    `gorm:"size:20" json:"media_type"`
	Location      string    `gorm:"size:255" json:"location"`
	PackageName   string    `gorm:"size:255" json:"package_name"`
	LikesCount    int       `gorm:"default:0" json:"likes_count"`
	CommentsCount int             `gorm:"default:0" json:"comments_count"`
	Tags          json.RawMessage `gorm:"type:jsonb" json:"tags"`
	CreatedAt     time.Time       `gorm:"default:now()" json:"created_at"`
	Status        string          `gorm:"type:package_status_enum;default:'public';index" json:"status"`
	User          User            `gorm:"foreignKey:UserID;references:UserID" json:"user,omitempty"`
}

type CommunityPostComment struct {
	CommentID uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"comment_id"`
	PostID    uuid.UUID `gorm:"type:uuid;not null" json:"post_id"`
	UserID    uuid.UUID `gorm:"type:uuid;not null" json:"user_id"`
	Text      string    `gorm:"text;not null" json:"text"`
	CreatedAt time.Time `gorm:"default:now()" json:"created_at"`
	User      User      `gorm:"foreignKey:UserID;references:UserID" json:"user,omitempty"`
}

type CommunityPostLike struct {
	PostID    uuid.UUID `gorm:"type:uuid;primaryKey" json:"post_id"`
	UserID    uuid.UUID `gorm:"type:uuid;primaryKey" json:"user_id"`
	CreatedAt time.Time `gorm:"default:now()" json:"created_at"`
}

// ✅ Auth Tokens (email verification + password reset)
type AuthToken struct {
	TokenID   uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"token_id"`
	UserID    uuid.UUID `gorm:"type:uuid;not null"                             json:"user_id"`
	Token     string    `gorm:"size:255;not null;uniqueIndex"                  json:"token"`
	TokenType string    `gorm:"type:auth_token_type;not null"                  json:"token_type"`
	Used      bool      `gorm:"default:false"                                  json:"used"`
	ExpiresAt time.Time `gorm:"not null"                                       json:"expires_at"`
	CreatedAt time.Time `gorm:"default:now()"                                  json:"created_at"`
}
