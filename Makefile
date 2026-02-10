# 🌍 Africa Tourism Intelligence Platform - Root Makefile

# --- Variables ---
BACKEND_DIR := backend
WEB_DIR     := apps/web
MOBILE_DIR  := apps/mobile

# --- Main Commands ---
.PHONY: help bootstrap setup clean

help: ## Show this help message
	@echo "Usage: make [target]"
	@echo ""
	@echo "General:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

bootstrap: ## Verify environment and setup dependencies
	@./scripts/bootstrap.sh

setup: ## Install dependencies for all components
	@echo "Installing all dependencies..."
	@cd $(BACKEND_DIR) && go mod tidy
	@cd $(WEB_DIR) && npm install
	@# cd $(MOBILE_DIR) && flutter pub get

clean: ## Clean up build artifacts and temporary files
	@./scripts/cleanup.sh

# --- Development Commands ---
.PHONY: dev-backend dev-web dev-mobile

dev-backend: ## Run the Go backend API
	@echo "Starting Go backend..."
	@cd $(BACKEND_DIR) && go run cmd/main.go

dev-web: ## Run the Next.js web application
	@echo "Starting Next.js web app..."
	@cd $(WEB_DIR) && npm run dev

dev-mobile: ## Run the Flutter mobile application
	@echo "Starting Flutter mobile app..."
	@cd $(MOBILE_DIR) && flutter run

# --- Linting & Formatting ---
.PHONY: lint format

lint: ## Run linters for all components
	@cd $(BACKEND_DIR) && golangci-lint run
	@cd $(WEB_DIR) && npm run lint

format: ## Format code in all components
	@cd $(BACKEND_DIR) && go fmt ./...
	@cd $(WEB_DIR) && npx prettier --write .
