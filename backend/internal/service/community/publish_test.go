package community

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestValidateForPublish(t *testing.T) {
	v := &PackageValidator{}

	t.Run("Valid Package", func(t *testing.T) {
		err := v.ValidateForPublish(3, "My Awesome Trip")
		assert.NoError(t, err)
	})

	t.Run("Empty Title", func(t *testing.T) {
		err := v.ValidateForPublish(3, "")
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "title is required")
	})

	t.Run("Insufficient Items", func(t *testing.T) {
		err := v.ValidateForPublish(2, "Short Trip")
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "at least 3 itinerary items")
	})
}
