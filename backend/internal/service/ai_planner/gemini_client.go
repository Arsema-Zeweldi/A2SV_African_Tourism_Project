package ai_planner

import "context"

// GeminiClient is the interface for any LLM backend.
// Production uses GeminiClientImpl; tests use a mock.
type GeminiClient interface {
	GenerateItinerary(ctx context.Context, req GenerateRequest) (*ItineraryResponse, error)
	ChatAboutActivity(ctx context.Context, req ActivityChatRequest) (*ActivityChatResponse, error)
}
