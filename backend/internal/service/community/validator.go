package community

import "errors"

// PackageValidator handles business logic validation for community packages
type PackageValidator struct{}

func (v *PackageValidator) ValidateForPublish(itemCount int, title string) error {
	if title == "" {
		return errors.New("title is required")
	}
	if itemCount < 3 {
		return errors.New("at least 3 itinerary items are required to publish a package")
	}
	return nil
}
