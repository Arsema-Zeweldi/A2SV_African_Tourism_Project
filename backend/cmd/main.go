package main

import (
	"log"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/api"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/config"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/database"
)

func main() {
	log.Println("🚀 Backend starting...")

	// 1. Load configuration
	log.Println("📂 Loading configuration...")
	cfg := config.LoadConfig()
	log.Println("✅ Configuration loaded")

	// 2. Initialize database
	log.Println("🗄️ Initializing database...")
	db, err := database.InitDB(cfg)
	if err != nil {
		log.Fatalf("❌ Failed to initialize database: %v", err)
	}
	log.Println("✅ Database initialized")

	// 3. Setup router
	log.Println("🌐 Setting up router...")
	r := api.SetupRouter(db, cfg)
	log.Println("✅ Router configured")

	// 4. Start server
	log.Printf("📡 Server attempting to start on port %s...", cfg.ServerPort)
	if err := r.Run(":" + cfg.ServerPort); err != nil {
		log.Fatalf("❌ Failed to start server: %v", err)
	}
}
