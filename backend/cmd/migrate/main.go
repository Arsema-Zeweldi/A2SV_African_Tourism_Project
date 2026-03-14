package main

import (
	"database/sql"
	"log/slog"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	godotenv.Load()
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		slog.Error("DATABASE_URL not set")
		os.Exit(1)
	}

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		slog.Error("Failed to open database", "error", err)
		os.Exit(1)
	}
	defer db.Close()

	// Wipe the public schema to start fresh
	_, err = db.Exec("DROP SCHEMA public CASCADE")
	if err != nil {
		slog.Error("Failed to drop public schema", "error", err)
		os.Exit(1)
	}
	_, err = db.Exec("CREATE SCHEMA public")
	if err != nil {
		slog.Error("Failed to create public schema", "error", err)
		os.Exit(1)
	}
	_, err = db.Exec("GRANT ALL ON SCHEMA public TO public")
	if err != nil {
		slog.Error("Failed to grant schema permissions", "error", err)
		os.Exit(1)
	}

	slog.Info("Database schema wiped and reset", "status", "clean slate")
}
