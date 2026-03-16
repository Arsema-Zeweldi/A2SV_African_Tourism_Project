package cache

import "testing"

func TestNoopClient(t *testing.T) {
	client := &NoopClient{}
	if err := client.Ping(nil); err == nil {
		t.Fatalf("expected error from NoopClient Ping")
	}
}
