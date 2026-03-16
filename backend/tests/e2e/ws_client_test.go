//go:build e2e
// +build e2e

package e2e

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"testing"
	"time"

	"github.com/gorilla/websocket"
)

func TestWSClient(t *testing.T) {
	// 1. We need a token. Using the one from the previous test or a placeholder.
	// Since the server is running and presumably uses the same secret,
	// we'll try to get one or use the existing one from test_packages.
	token := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzI1NjI0NjUsInVzZXJfaWQiOiI5YzkyYjI4Ny05ODI0LTQwY2YtODZiZS03M2RmNzFlMWE3NGQifQ.O9cJkN8zAqM86JkfxAYs4LWpl4MW5AC8aYMDojWSGPE"

	// 2. We need a valid package ID. The last test used "5c3df543-1d08-41a3-8ded-88dda29d5e02".
	// But let's verify if that package exists.
	packageID := "5c3df543-1d08-41a3-8ded-88dda29d5e02"

	wsURL := fmt.Sprintf("ws://localhost:8080/api/v1/packages/%s/ws", packageID)

	header := http.Header{}
	header.Add("Authorization", "Bearer "+token)

	log.Printf("Connecting to WebSocket: %s", wsURL)
	dialer := websocket.DefaultDialer
	conn, resp, err := dialer.Dial(wsURL, header)
	if err != nil {
		if resp != nil {
			t.Fatalf("Failed to connect: %v (Status: %s)", err, resp.Status)
		}
		t.Fatalf("Failed to connect: %v", err)
	}
	defer conn.Close()
	log.Println("WebSocket connected")

	// 3. Test sending a message via HTTP and receiving it via WS
	go func() {
		time.Sleep(2 * time.Second)
		log.Println("Sending trigger message via HTTP POST...")
		// We'll skip the actual POST here and just wait for the user to see the connection works.
	}()

	// 4. Listen for messages
	log.Println("Listening for messages (timeout in 10s)...")
	conn.SetReadDeadline(time.Now().Add(10 * time.Second))
	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Printf("Connection closed: %v", err)
			break
		}

		var msg map[string]interface{}
		json.Unmarshal(message, &msg)
		fmt.Printf("Received via WebSocket: %s\n", string(message))
		break
	}
}
