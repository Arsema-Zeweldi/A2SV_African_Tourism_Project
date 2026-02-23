package models

import (
	"time"

	"github.com/google/uuid"
)

// ✅ User & IAM
type User struct {
	UserID          uuid.UUID      `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"user_id"`
	Email           string         `gorm:"size:255;unique;not null" json:"email"`
	PasswordHash    string         `gorm:"size:255;not null" json:"-"`
	FirstName       string         `gorm:"size:100" json:"first_name"`
	LastName        string         `gorm:"size:100" json:"last_name"`
	PhoneNumber     string         `gorm:"size:50" json:"phone_number"`
	Country         string         `gorm:"size:100" json:"country"`
	ProfileImageURL string         `gorm:"text" json:"profile_image_url"`
	AccountType     string         `gorm:"type:account_type_enum;default:'traveler'" json:"account_type"`
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
	TravelerType        string    `gorm:"type:traveler_type_enum" json:"traveler_type"`
	PreferredSeason     string    `gorm:"type:preferred_season_enum" json:"preferred_season"`
	BudgetRange         string    `gorm:"type:budget_range_enum" json:"budget_range"`
	TripDuration        string    `gorm:"type:trip_duration_enum" json:"trip_duration"`
	PreferredActivities []byte    `gorm:"type:jsonb" json:"preferred_activities"`
	DietaryRestrictions []byte    `gorm:"type:jsonb" json:"dietary_restrictions"`
	AccessibilityNeeds  []byte    `gorm:"type:jsonb" json:"accessibility_needs"`
	CreatedAt           time.Time `gorm:"not null;default:now()" json:"created_at"`
	UpdatedAt           time.Time `gorm:"not null;default:now()" json:"updated_at"`
}

// ✅ Geography & Discovery
type Region struct {
	RegionID    uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"region_id"`
	Name        string    `gorm:"size:150;not null" json:"name"`
	Slug        string    `gorm:"size:150;unique;not null" json:"slug"`
	Description string    `gorm:"text" json:"description"`
}

type Country struct {
	CountryID    uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"country_id"`
	Name         string    `gorm:"size:150;not null" json:"name"`
	ISOCode      string    `gorm:"type:char(2);unique;not null" json:"iso_code"`
	Capital      string    `gorm:"size:150" json:"capital"`
	CurrencyCode string    `gorm:"size:10" json:"currency_code"`
	FlagEmoji    string    `gorm:"size:10" json:"flag_emoji"`
	RegionID     uuid.UUID `gorm:"type:uuid;not null" json:"region_id"`
	Region       Region    `gorm:"foreignKey:RegionID" json:"region"`
}

type Destination struct {
	DestinationID    uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"destination_id"`
	Name             string    `gorm:"size:200;not null" json:"name"`
	Slug             string    `gorm:"size:200;unique;not null" json:"slug"`
	Description      string    `gorm:"text" json:"description"`
	ShortDescription string    `gorm:"size:255" json:"short_description"`
	CountryID        uuid.UUID `gorm:"type:uuid;not null" json:"country_id"`
	RegionID         uuid.UUID `gorm:"type:uuid;not null" json:"region_id"`
	City             string    `gorm:"size:150" json:"city"`
	Latitude         float64   `gorm:"type:decimal(10,7)" json:"latitude"`
	Longitude        float64   `gorm:"type:decimal(10,7)" json:"longitude"`
	DestinationType  string    `gorm:"type:destination_type_enum" json:"destination_type"`
	HeroImageURL     string    `gorm:"text" json:"hero_image_url"`
	AverageRating    float64   `gorm:"type:decimal(3,2);default:0" json:"average_rating"`
	TotalReviews     int       `gorm:"default:0" json:"total_reviews"`
	AnnualVisitors   int       `json:"annual_visitors"`
	BestSeason       string    `gorm:"type:best_season_enum" json:"best_season"`
	PriceLevel       int       `gorm:"check:price_level BETWEEN 1 AND 5" json:"price_level"`
	IsUnescoSite     bool      `gorm:"default:false" json:"is_unesco_site"`
	IsActive         bool      `gorm:"default:true" json:"is_active"`
	CreatedAt        time.Time `gorm:"not null;default:now()" json:"created_at"`
	UpdatedAt        time.Time `gorm:"not null;default:now()" json:"updated_at"`
	Country          Country   `gorm:"foreignKey:CountryID" json:"country"`
	Tags             []Tag     `gorm:"many2many:destination_tags" json:"tags"`
}

type Tag struct {
	TagID      uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"tag_id"`
	Name       string    `gorm:"size:100;unique;not null" json:"name"`
	Slug       string    `gorm:"size:100;unique;not null" json:"slug"`
	Category   string    `gorm:"size:100" json:"category"`
	UsageCount int       `gorm:"default:0" json:"usage_count"`
}

// ✅ Interactions
type Review struct {
	ReviewID      uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"review_id"`
	UserID        uuid.UUID `gorm:"type:uuid;not null" json:"user_id"`
	DestinationID uuid.UUID `gorm:"type:uuid;not null" json:"destination_id"`
	Rating        float64   `gorm:"type:decimal(2,1);check:rating BETWEEN 1 AND 5" json:"rating"`
	Title         string    `gorm:"size:255" json:"title"`
	Content       string    `gorm:"text" json:"content"`
	VisitDate     time.Time `json:"visit_date"`
	HelpfulCount  int       `gorm:"default:0" json:"helpful_count"`
	IsVerified    bool      `gorm:"default:false" json:"is_verified"`
	IsPublished   bool      `gorm:"default:true" json:"is_published"`
	CreatedAt     time.Time `gorm:"not null;default:now()" json:"created_at"`
	UpdatedAt     time.Time `gorm:"not null;default:now()" json:"updated_at"`
}

type UserRecommendation struct {
	RecommendationID      uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"recommendation_id"`
	UserID                uuid.UUID `gorm:"type:uuid;not null" json:"user_id"`
	DestinationID         uuid.UUID `gorm:"type:uuid;not null" json:"destination_id"`
	MatchScore            float64   `gorm:"type:decimal(5,4)" json:"match_score"`
	Reasoning             string    `gorm:"text" json:"reasoning"`
	RecommendationFactors []byte    `gorm:"type:jsonb" json:"recommendation_factors"`
	UserClicked           bool      `gorm:"default:false" json:"user_clicked"`
	UserSaved             bool      `gorm:"default:false" json:"user_saved"`
	CreatedAt             time.Time `gorm:"not null;default:now()" json:"created_at"`
}

// ✅ AI & Analytics
type AIInsight struct {
	InsightID     uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"insight_id"`
	InsightType   string     `gorm:"type:insight_type_enum;not null" json:"insight_type"`
	Title         string     `gorm:"size:255" json:"title"`
	Content       string     `gorm:"text" json:"content"`
	Icon          string     `gorm:"size:100" json:"icon"`
	DestinationID uuid.UUID  `gorm:"type:uuid;not null" json:"destination_id"`
	IsActive      bool       `gorm:"default:true" json:"is_active"`
	ValidUntil    *time.Time `json:"valid_until"`
	CreatedAt     time.Time  `gorm:"not null;default:now()" json:"created_at"`
}

type AnalyticsEvent struct {
	EventID       uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"event_id"`
	UserID        *uuid.UUID `gorm:"type:uuid" json:"user_id"`
	EventType     string     `gorm:"size:100" json:"event_type"`
	EventCategory string     `gorm:"size:100" json:"event_category"`
	EventData     []byte     `gorm:"type:jsonb" json:"event_data"`
	DestinationID *uuid.UUID `gorm:"type:uuid" json:"destination_id"`
	SessionID     uuid.UUID  `gorm:"type:uuid" json:"session_id"`
	IPAddress     string     `gorm:"size:50" json:"ip_address"`
	UserAgent     string     `gorm:"text" json:"user_agent"`
	CreatedAt     time.Time  `gorm:"not null;default:now()" json:"created_at"`
}

type VisitorStatistic struct {
	StatID          uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"stat_id"`
	DestinationID   uuid.UUID `gorm:"type:uuid;not null" json:"destination_id"`
	Year            int       `gorm:"not null" json:"year"`
	Quarter         int       `gorm:"check:quarter BETWEEN 1 AND 4" json:"quarter"`
	Month           int       `gorm:"check:month BETWEEN 1 AND 12" json:"month"`
	TotalVisitors   int       `json:"total_visitors"`
	RevenueUSD      float64   `gorm:"type:decimal(12,2)" json:"revenue_usd"`
	AverageStayDays float64   `gorm:"type:decimal(4,2)" json:"average_stay_days"`
	SourceMarkets   []byte    `gorm:"type:jsonb" json:"source_markets"`
	CreatedAt       time.Time `gorm:"not null;default:now()" json:"created_at"`
}

// ✅ Missing Modules (Intelligence, AI, Community)
type VisaRequirement struct {
	VisaID               uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"visa_id"`
	SourceCountryID      uuid.UUID `gorm:"type:uuid;not null" json:"source_country_id"`
	DestinationCountryID uuid.UUID `gorm:"type:uuid;not null" json:"destination_country_id"`
	VisaType             string    `gorm:"type:visa_type_enum;not null" json:"visa_type"`
	Description          string    `gorm:"text" json:"description"`
	CostUSD              float64   `gorm:"type:decimal(10,2)" json:"cost_usd"`
	ValidDays            int       `json:"valid_days"`
	LastUpdated          time.Time `gorm:"default:now()" json:"last_updated"`
}

type SafetyAlert struct {
	AlertID       uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"alert_id"`
	CountryID     uuid.UUID  `gorm:"type:uuid;not null" json:"country_id"`
	DestinationID *uuid.UUID `gorm:"type:uuid" json:"destination_id"`
	Level         int        `gorm:"check:level BETWEEN 1 AND 5" json:"level"`
	Message       string     `gorm:"text;not null" json:"message"`
	SourceURL     string     `gorm:"text" json:"source_url"`
	CreatedAt     time.Time  `gorm:"default:now()" json:"created_at"`
	ValidUntil    *time.Time `json:"valid_until"`
}

type Itinerary struct {
	ItineraryID   uuid.UUID       `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"itinerary_id"`
	UserID        uuid.UUID       `gorm:"type:uuid;not null" json:"user_id"`
	Title         string          `gorm:"size:255;not null" json:"title"`
	Description   string          `gorm:"text" json:"description"`
	StartDate     *time.Time      `json:"start_date"`
	EndDate       *time.Time      `json:"end_date"`
	TotalCostEst  float64         `gorm:"type:decimal(12,2)" json:"total_cost_est"`
	IsAIGenerated bool            `gorm:"default:false" json:"is_ai_generated"`
	CreatedAt     time.Time       `gorm:"default:now()" json:"created_at"`
	UpdatedAt     time.Time       `gorm:"default:now()" json:"updated_at"`
	Items         []ItineraryItem `gorm:"foreignKey:ItineraryID" json:"items"`
}

type ItineraryItem struct {
	ItemID              uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"item_id"`
	ItineraryID         uuid.UUID  `gorm:"type:uuid;not null" json:"itinerary_id"`
	DestinationID       *uuid.UUID `gorm:"type:uuid" json:"destination_id"`
	DayNumber           int        `gorm:"not null" json:"day_number"`
	ActivityName        string     `gorm:"size:255;not null" json:"activity_name"`
	ActivityDescription string     `gorm:"text" json:"activity_description"`
	CostEst             float64    `gorm:"type:decimal(10,2)" json:"cost_est"`
	Latitude            float64    `gorm:"type:decimal(10,7)" json:"latitude"`
	Longitude           float64    `gorm:"type:decimal(10,7)" json:"longitude"`
	StartTime           string     `gorm:"type:time" json:"start_time"`
	EndTime             string     `gorm:"type:time" json:"end_time"`
}

type Package struct {
	PackageID    uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"package_id"`
	CreatorID    uuid.UUID `gorm:"type:uuid;not null" json:"creator_id"`
	ItineraryID  uuid.UUID `gorm:"type:uuid;not null" json:"itinerary_id"`
	Title        string    `gorm:"size:255;not null" json:"title"`
	Summary      string    `gorm:"text" json:"summary"`
	Price        float64   `gorm:"type:decimal(10,2);default:0" json:"price"`
	Status       string    `gorm:"type:package_status_enum;default:'draft'" json:"status"`
	RatingAvg    float64   `gorm:"type:decimal(3,2);default:0" json:"rating_avg"`
	ReviewsCount int       `gorm:"default:0" json:"reviews_count"`
	CreatedAt    time.Time `gorm:"default:now()" json:"created_at"`
}

type PackageReview struct {
	ReviewID  uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"review_id"`
	PackageID uuid.UUID `gorm:"type:uuid;not null" json:"package_id"`
	UserID    uuid.UUID `gorm:"type:uuid;not null" json:"user_id"`
	Rating    int       `gorm:"check:rating BETWEEN 1 AND 5" json:"rating"`
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
