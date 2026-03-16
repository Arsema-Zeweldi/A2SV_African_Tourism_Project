package discovery

import (
	"context"
	"strings"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/repository"
	"github.com/google/uuid"
)

// SearchService defines the interface for destination search.
type SearchService interface {
	SearchDestinations(ctx context.Context, filters repository.DestinationSearchFilters) ([]models.Destination, int64, error)
	GetDestination(ctx context.Context, id string) (*models.Destination, error)
}

// DestinationSearchService is the concrete implementation.
type DestinationSearchService struct {
	repo repository.DestinationRepository
}

func NewDestinationSearchService(repo repository.DestinationRepository) *DestinationSearchService {
	return &DestinationSearchService{repo: repo}
}

// SearchDestinations delegates to the repository after normalising empty-string tags.
func (s *DestinationSearchService) SearchDestinations(ctx context.Context, filters repository.DestinationSearchFilters) ([]models.Destination, int64, error) {
	// Normalise tag strings (split comma-separated tag slug string if needed)
	if len(filters.Tags) == 1 && strings.Contains(filters.Tags[0], ",") {
		parts := strings.Split(filters.Tags[0], ",")
		cleaned := make([]string, 0, len(parts))
		for _, p := range parts {
			if t := strings.TrimSpace(p); t != "" {
				cleaned = append(cleaned, t)
			}
		}
		filters.Tags = cleaned
	}
	return s.repo.Search(ctx, filters)
}

// GetDestination parses the UUID string and fetches the destination by ID.
func (s *DestinationSearchService) GetDestination(ctx context.Context, id string) (*models.Destination, error) {
	uid, err := uuid.Parse(id)
	if err != nil {
		return nil, err
	}
	return s.repo.GetByID(ctx, uid)
}
