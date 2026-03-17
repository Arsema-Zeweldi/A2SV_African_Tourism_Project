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

// Activity is one item within a day's plan — reflects the PRD JSON schema.
type Activity struct {
	Name        string  `json:"name"`
	Type        string  `json:"type"` // food | adventure | culture | party | wildlife
	Description string  `json:"description"`
	EstCost     float64 `json:"est_cost"`
	GeoLat      float64 `json:"geo_lat"`
	GeoLong     float64 `json:"geo_long"`
}

// DayPlan holds all activities for one day of the trip.
type DayPlan struct {
	DayNum     int        `json:"day_num"`
	Activities []Activity `json:"activities"`
}

// ItineraryResponse is the structured output from the AI model.
type ItineraryResponse struct {
	Title    string    `json:"title"`
	Currency string    `json:"currency"`
	Days     []DayPlan `json:"days"`
}
