package ai_planner

import (
	"context"
	"fmt"
	"log/slog"
	"time"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

// GeminiClientImpl is the production Gemini API client.
type GeminiClientImpl struct {
	client *genai.Client
	model  string
}

// NewGeminiClientImpl initialises the Gemini client with the given API key.
func NewGeminiClientImpl(ctx context.Context, apiKey, model string) (*GeminiClientImpl, error) {
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return nil, fmt.Errorf("failed to create Gemini client: %w", err)
	}
	if model == "" {
		model = "gemini-1.5-flash-latest"
	}
	return &GeminiClientImpl{client: client, model: model}, nil
}

// GenerateItinerary calls the Gemini API with a 30-second timeout,
// enforces JSON response mode, and parses the structured output.
func (g *GeminiClientImpl) GenerateItinerary(ctx context.Context, req GenerateRequest) (*ItineraryResponse, error) {
	// Hard 30-second timeout on the LLM call — PRD requires ≤4s total response
	llmCtx, cancel := context.WithTimeout(ctx, 30*time.Second)
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
