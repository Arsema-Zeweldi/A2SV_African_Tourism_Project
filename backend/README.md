# 🌍 Africa Tourism Platform - Backend

Welcome to the backend repository for the Africa Tourism Platform. This is a production-grade Go backend designed for intra-African travel intelligence, featuring AI-assisted planning, community-driven itineraries, and real-time travel alerts.

## 🚀 Quick Start (For Frontend & Team)

The easiest way to run the entire backend stack (Go + Redis + PostgreSQL) is using Docker Compose.

### 1. Prerequisites
- **Docker & Docker Compose** installed.

### 2. Setup
1.  **Navigate to directory**:
    ```bash
    cd backend
    ```
2.  **Environment Configuration**:
    Create a `.env` file by copying the example:
    ```bash
    cp .env.example .env
    ```
3.  **Add Shared API Keys**:
    Open the `.env` file and fill in the shared keys for:
    - `GEMINI_API_KEY` (AI Planning)
    - `CLOUDINARY_URL` (Image/Video Uploads)

### 3. Launch
Run the following command to build and start all services:
```bash
docker-compose up --build -d
```
*Note: The first run will automatically initialize the database and run all migrations.*

### 4. Access API Documentation
Once the server is running, you can access the interactive Swagger UI here:
👉 **[http://localhost:8080/docs](http://localhost:8080/docs)**

> [!TIP]
> **Data Formats**: The API supports both `application/json` and `multipart/form-data`. 
> - Routes like `POST /packages`, `POST /posts`, and `PATCH /user/profile` accept **Multipart** to support direct image/video uploads.
> - The documentation indicates supported formats for each endpoint.

---

## 🛠️ Developer Setup (Manual)

If you prefer to run the services individually without Docker:

### 1. Prerequisites
- **Go**: 1.23+
- **PostgreSQL**: 16+
- **Redis**: 6.x+

### 2. Database Migrations
We use versioned migrations. Ensure your `DATABASE_URL` is set in `.env` and run:
```bash
migrate -path migrations -database "$DATABASE_URL" up
```
*Warning: Running `go run cmd/migrate/main.go` will WIPE the entire database.*

### 3. Running Locally
```bash
go mod tidy
go run cmd/server/main.go
```

---

## 🏗️ Production Features
- **AI Planning**: Deterministic caching with Redis + Google Gemini integration.
- **Media Storage**: Cloudinary integration for secure image (JPEG, PNG, WEBP, GIF) and video (MP4, WEBM) storage.
- **Security**: RBAC middleware, Redis-backed rate limiting, JWT authentication, and Bcrypt encryption.
- **Cross-Origin**: Secure, origin-validated CORS implementation.
- **Resilience**: 30s Graceful shutdown, database connection pooling, and Redis-Noop fallback.

## 🧪 Testing
Run all unit tests:
```bash
go test ./...
```

## 📂 Architecture
- `internal/api/`: Routing, Handlers, and Middlewares.
- `internal/service/`: Business logic.
- `internal/repository/`: Data access layer (GORM).
- `internal/api/openapi.yaml`: OpenAPI 3.0 specification.
- `docker-compose.yaml`: Full-stack orchestration (App, Redis, DB).

---
*Built for the A2SV African Tourism Project. Mobile-First • Africa-First.*
