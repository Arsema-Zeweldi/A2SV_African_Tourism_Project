package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"gorm.io/gorm"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 4096
)

type WSMessage struct {
	PackageID string    `json:"package_id"`
	UserID    string    `json:"user_id"`
	Message   string    `json:"message"`
	CreatedAt time.Time `json:"created_at"`
}

type Client struct {
	hub       *Hub
	conn      *websocket.Conn
	send      chan []byte
	packageID uuid.UUID
	userID    uuid.UUID
}

func (cl *Client) readPump(db *gorm.DB) {
	defer func() {
		cl.hub.unregister <- cl
		cl.conn.Close()
	}()

	cl.conn.SetReadLimit(maxMessageSize)
	cl.conn.SetReadDeadline(time.Now().Add(pongWait))
	cl.conn.SetPongHandler(func(string) error {
		cl.conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		_, rawMsg, err := cl.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("[ChatHub] unexpected close for package %s: %v", cl.packageID, err)
			}
			break
		}

		var req ChatRequest
		if err := json.Unmarshal(rawMsg, &req); err != nil || req.Message == "" {
			continue
		}

		record := models.PackageChat{
			PackageID: cl.packageID,
			UserID:    cl.userID,
			Message:   req.Message,
		}
		if err := db.Create(&record).Error; err != nil {
			log.Printf("[ChatHub] DB write error: %v", err)
			continue
		}

		envelope := WSMessage{
			PackageID: cl.packageID.String(),
			UserID:    cl.userID.String(),
			Message:   req.Message,
			CreatedAt: record.CreatedAt,
		}
		payload, _ := json.Marshal(envelope)

		cl.hub.broadcast <- broadcastMsg{packageID: cl.packageID, payload: payload}
	}
}

func (cl *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		cl.conn.Close()
	}()

	for {
		select {
		case message, ok := <-cl.send:
			cl.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				cl.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			w, err := cl.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)
			n := len(cl.send)
			for i := 0; i < n; i++ {
				w.Write([]byte{'\n'})
				w.Write(<-cl.send)
			}
			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			cl.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := cl.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

type broadcastMsg struct {
	packageID uuid.UUID
	payload   []byte
}

type Hub struct {
	mu         sync.RWMutex
	clients    map[uuid.UUID]map[*Client]struct{}
	register   chan *Client
	unregister chan *Client
	broadcast  chan broadcastMsg
}

var GlobalHub *Hub

func NewHub() *Hub {
	return &Hub{
		clients:    make(map[uuid.UUID]map[*Client]struct{}),
		register:   make(chan *Client, 64),
		unregister: make(chan *Client, 64),
		broadcast:  make(chan broadcastMsg, 256),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case cl := <-h.register:
			h.mu.Lock()
			if _, ok := h.clients[cl.packageID]; !ok {
				h.clients[cl.packageID] = make(map[*Client]struct{})
			}
			h.clients[cl.packageID][cl] = struct{}{}
			h.mu.Unlock()

		case cl := <-h.unregister:
			h.mu.Lock()
			if room, ok := h.clients[cl.packageID]; ok {
				if _, inRoom := room[cl]; inRoom {
					delete(room, cl)
					close(cl.send)
					if len(room) == 0 {
						delete(h.clients, cl.packageID)
					}
				}
			}
			h.mu.Unlock()

		case msg := <-h.broadcast:
			h.mu.RLock()
			room := h.clients[msg.packageID]
			h.mu.RUnlock()
			for cl := range room {
				select {
				case cl.send <- msg.payload:
				default:
					h.mu.Lock()
					delete(h.clients[msg.packageID], cl)
					close(cl.send)
					h.mu.Unlock()
				}
			}
		}
	}
}

func (h *Hub) BroadcastToPackage(packageID uuid.UUID, chat models.PackageChat) {
	envelope := WSMessage{
		PackageID: packageID.String(),
		UserID:    chat.UserID.String(),
		Message:   chat.Message,
		CreatedAt: chat.CreatedAt,
	}
	payload, err := json.Marshal(envelope)
	if err != nil {
		return
	}
	select {
	case h.broadcast <- broadcastMsg{packageID: packageID, payload: payload}:
	default:
	}
}

func ServeWS(hub *Hub, db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, err := getUserID(c)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		packageID, err := uuid.Parse(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid package ID"})
			return
		}

		var pkg models.Package
		if err := db.First(&pkg, "package_id = ?", packageID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Package not found"})
			return
		}

		conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			log.Printf("[ChatHub] upgrade error: %v", err)
			return
		}

		client := &Client{
			hub:       hub,
			conn:      conn,
			send:      make(chan []byte, 256),
			packageID: packageID,
			userID:    userID,
		}

		hub.register <- client

		go client.writePump()
		go client.readPump(db)
	}
}
