package ai_planner

import (
	"context"
	"fmt"
	"log/slog"
	"strings"
	"time"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

// GeminiClientImpl is the production Gemini API client.
type GeminiClientImpl struct {
	client  *genai.Client
	model   string
	timeout time.Duration
}

// NewGeminiClientImpl initialises the Gemini client with the given API key.
func NewGeminiClientImpl(ctx context.Context, apiKey, model string, timeout int) (*GeminiClientImpl, error) {
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return nil, fmt.Errorf("failed to create Gemini client: %w", err)
	}
	if model == "" {
		model = "gemini-1.5-flash-latest"
	}
	if timeout <= 0 {
		timeout = 120
	}
	return &GeminiClientImpl{
		client:  client,
		model:   model,
		timeout: time.Duration(timeout) * time.Second,
	}, nil
}

// GenerateItinerary calls the Gemini API with a 30-second timeout,
// enforces JSON response mode, and parses the structured output.
func (g *GeminiClientImpl) GenerateItinerary(ctx context.Context, req GenerateRequest) (*ItineraryResponse, error) {
	// use configured timeout
	llmCtx, cancel := context.WithTimeout(ctx, g.timeout)
	defer cancel()

	prompt := BuildPrompt(req)

	m := g.client.GenerativeModel(g.model)
	// Enforce JSON mode — prevents the model from wrapping output in markdown
	m.ResponseMIMEType = "application/json"

	slog.Info("Calling Gemini API", "model", g.model, "destination", req.Destination)

	resp, err := m.GenerateContent(llmCtx, genai.Text(prompt))
	if err != nil {
		return nil, fmt.Errorf("Gemini API error: %w", err)
	}

	if resp == nil || len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("Gemini returned empty response")
	}

	rawText, ok := resp.Candidates[0].Content.Parts[0].(genai.Text)
	if !ok {
		return nil, fmt.Errorf("unexpected part type from Gemini")
	}

	result, err := ParseAIResponse([]byte(rawText))
	if err != nil {
		slog.Warn("Failed to parse Gemini response", "error", err, "raw", string(rawText))
		return nil, fmt.Errorf("AI response parsing failed: %w", err)
	}

	return result, nil
}

// ChatAboutActivity calls the Gemini API to answer a user question about a specific activity.
func (g *GeminiClientImpl) ChatAboutActivity(ctx context.Context, req ActivityChatRequest) (*ActivityChatResponse, error) {
	llmCtx, cancel := context.WithTimeout(ctx, g.timeout)
	defer cancel()

	prompt := fmt.Sprintf(`You are an expert African travel guide. A traveler is asking about this activity on their itinerary:

Activity: %s
Description: %s
Location: %s

Their question: %s

Answer concisely in 2-4 sentences. Be helpful and practical. If you don't know, say so.`,
		req.ActivityTitle, req.ActivityDescription, req.ActivityLocation, req.Question)

	m := g.client.GenerativeModel(g.model)

	slog.Info("Calling Gemini API for activity chat", "model", g.model, "activity", req.ActivityTitle)

	resp, err := m.GenerateContent(llmCtx, genai.Text(prompt))
	if err != nil {
		return nil, fmt.Errorf("Gemini API error: %w", err)
	}

	if resp == nil || len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("Gemini returned empty response")
	}

	rawText, ok := resp.Candidates[0].Content.Parts[0].(genai.Text)
	if !ok {
		return nil, fmt.Errorf("unexpected part type from Gemini")
	}

	return &ActivityChatResponse{Answer: strings.TrimSpace(string(rawText))}, nil
}
