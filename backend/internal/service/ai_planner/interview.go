package ai_planner

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/cache"
)

// PlannerService is the interface for the AI planning service.
type PlannerService interface {
	GenerateItinerary(ctx context.Context, req GenerateRequest) (*ItineraryResponse, error)
	ChatAboutActivity(ctx context.Context, req ActivityChatRequest) (*ActivityChatResponse, error)
}

// InterviewService implements PlannerService with a cache-aside pattern.
type InterviewService struct {
	client GeminiClient
	cache  cache.Client
}

// NewInterviewService creates a new planner service.
func NewInterviewService(client GeminiClient, redisClient cache.Client) *InterviewService {
	return &InterviewService{
		client: client,
		cache:  redisClient,
	}
}

// itineraryTTL is how long AI-generated itineraries are cached.
// 24 hours is reasonable — destinations don't change daily.
const itineraryTTL = 24 * time.Hour

// GenerateItinerary implements the cache-aside pattern:
//  1. Build a deterministic cache key from request params
//  2. Check Redis — return cached result if found (cache hit)
//  3. On cache miss → call Gemini API → parse response
//  4. Store result in Redis with TTL
//  5. Return result
func (s *InterviewService) GenerateItinerary(ctx context.Context, req GenerateRequest) (*ItineraryResponse, error) {
	if req.Destination == "" {
		return nil, errors.New("destination is required")
	}
	if req.DurationDays <= 0 {
		return nil, errors.New("duration_days must be greater than 0")
	}

	cacheKey := BuildCacheKey(req)

	// ── 1. Cache check ────────────────────────────────────────────────────────
	if cached, err := s.cache.Get(ctx, cacheKey); err == nil {
		var result ItineraryResponse
		if jsonErr := json.Unmarshal([]byte(cached), &result); jsonErr == nil {
			slog.Info("AI planner cache hit", "key", cacheKey)
			return &result, nil
		}
	}

	slog.Info("AI planner cache miss — calling Gemini", "key", cacheKey, "destination", req.Destination)

	// ── 2. Call LLM ───────────────────────────────────────────────────────────
	result, err := s.client.GenerateItinerary(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("AI generation failed: %w", err)
	}

	// ── 3. Cache the result ───────────────────────────────────────────────────
	if data, jsonErr := json.Marshal(result); jsonErr == nil {
		if cacheErr := s.cache.Set(ctx, cacheKey, string(data), itineraryTTL); cacheErr != nil {
			// Non-fatal: log but continue — the user still gets their itinerary
			slog.Warn("Failed to cache itinerary", "key", cacheKey, "error", cacheErr)
		}
	}

	return result, nil
}

// ChatAboutActivity answers a user question about a specific activity.
// No caching — each question is unique.
func (s *InterviewService) ChatAboutActivity(ctx context.Context, req ActivityChatRequest) (*ActivityChatResponse, error) {
	if req.Question == "" {
		return nil, errors.New("question is required")
	}
	return s.client.ChatAboutActivity(ctx, req)
}

// StartInterview is kept for backward-compatibility with the existing interface.
// It delegates to GenerateItinerary.
func (s *InterviewService) StartInterview(ctx context.Context, input StartInterviewInput) (*StartInterviewResult, error) {
	req := GenerateRequest{
		Destination:  input.PromptSeed,
		DurationDays: 3,
		BudgetLevel:  "medium",
		VibeTags:     []string{},
	}
	if dest, ok := input.Answers["destination"]; ok {
		req.Destination = dest
	}
	if req.Destination == "" {
		return nil, errors.New("destination is required")
	}
	_, err := s.GenerateItinerary(ctx, req)
	if err != nil {
		return nil, err
	}
	return &StartInterviewResult{Prompt: req.Destination}, nil
}
