package ai_planner

// GenerateRequest is the input to the AI planning pipeline.
type GenerateRequest struct {
	Destination  string   `json:"destination"`   // e.g. "Nairobi, Kenya"
	DurationDays int      `json:"duration_days"` // e.g. 3
	Budget       float64  `json:"budget"`        // budget in USD
	BudgetLevel  string   `json:"budget_level"`  // low | medium | luxury
	VibeTags     []string `json:"vibe_tags"`     // adventure, nightlife, foodie, etc.
	GroupSize    int      `json:"group_size"`    // number of people
	ClimatePref  string   `json:"climate_pref"`  // tropical | desert | coastal | highland
	MultiCountry bool     `json:"multi_country"` // multi-country trip
	Notes        string   `json:"notes"`         // additional user notes
}

// Activity is one activity within a trip — mirrors CreateItineraryActivity DTO.
type Activity struct {
	DayNumber     int     `json:"day_number"`
	OrderIndex    int     `json:"order_index"`
	Title         string  `json:"title"`
	Description   string  `json:"description"`
	CostLabel     string  `json:"cost_label"`    // e.g. "30 USD"
	ActivityType  string  `json:"activity_type"` // food | adventure | culture | party | wildlife
	Latitude      float64 `json:"latitude"`
	Longitude     float64 `json:"longitude"`
	AIPick        bool    `json:"ai_pick"`
}

// ItineraryResponse is the structured output from the AI model — mirrors CreateItineraryRequest DTO.
type ItineraryResponse struct {
	Title       string     `json:"title"`
	Description string     `json:"description"`
	DaysCount   int        `json:"days_count"`
	NightsCount int        `json:"nights_count"`
	Activities  []Activity `json:"activities"`
}

// ActivityChatRequest is the input for the activity chat endpoint.
type ActivityChatRequest struct {
	ActivityTitle       string `json:"activity_title"`
	ActivityDescription string `json:"activity_description"`
	ActivityLocation    string `json:"activity_location"`
	Question            string `json:"question"`
}

// ActivityChatResponse is the output from the activity chat endpoint.
type ActivityChatResponse struct {
	Answer string `json:"answer"`
}
