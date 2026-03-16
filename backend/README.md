# 🌍 Africa Tourism Platform - Backend

Welcome to the backend repository for the Africa Tourism Platform. This is a production-grade Go backend designed for intra-African travel intelligence, featuring AI-assisted planning, community-driven itineraries, and real-time travel alerts.

## 🚀 Quick Start

### 1. Prerequisites
- **Go**: 1.23+
- **PostgreSQL**: 15+
- **Redis**: 6.x+ (See [REDIS_SETUP.md](REDIS_SETUP.md))
- **Docker** (optional): for containerized runs

### 2. Environment Configuration
Create a `.env` file in the `backend/` directory (or copy from `.env.example`):

```env
SERVER_PORT=8080
DATABASE_URL=postgres://user:pass@localhost:5432/africa_tourism?sslmode=disable
JWT_SECRET=your_mandatory_secret_key
REDIS_URL=redis://localhost:6379
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
GEMINI_API_KEY=your_google_ai_key
GEMINI_MODEL=gemini-2.5-flash
```

### 3. Database Migrations
We use versioned migrations. Use your migration tool of choice (e.g., `golang-migrate`):

```bash
# Manual up
migrate -path migrations -database "$DATABASE_URL" up
```

Notes:
- [migrations/001_init.up.sql](migrations/001_init.up.sql) matches the current models.
- [migrations/001_init_schema_legacy.sql](migrations/001_init_schema_legacy.sql) is kept only as a legacy snapshot.

Warning:
- [cmd/migrate/main.go](cmd/migrate/main.go) DROPS the entire `public` schema and wipes all data. Run it only for local/dev resets.

### 4. Running the Project
```bash
cd backend
go mod tidy
go run cmd/server/main.go
```

### 5. Docker
Build the image:
```bash
docker build -t africa-tourism-backend .
```

Run the container (point to host DB/Redis):
```bash
docker run --rm -p 8080:8080 \
	-e SERVER_PORT=8080 \
	-e DATABASE_URL="postgres://user:pass@host.docker.internal:5432/africa_tourism?sslmode=disable" \
	-e REDIS_URL="redis://host.docker.internal:6379" \
	-e JWT_SECRET="your_mandatory_secret_key" \
	-e ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173" \
	-e GEMINI_API_KEY="your_google_ai_key" \
	-e GEMINI_MODEL="gemini-2.5-flash" \
	africa-tourism-backend
```

## 🏗️ Production Features
- **AI Planning**: deterministic caching with Redis + Google Gemini integration.
- **Security**: RBAC middleware, IP-based rate limiting, JWT with role claims, and bcrypt cost 12.
- **Observability**: Structured JSON logging (`slog`), Request-ID tracking, and `/health` monitoring.
- **Resilience**: 30s Graceful shutdown and database connection pooling.
- **Redis**: cache-aside with a Noop fallback if Redis is unavailable.

## 🧪 Testing
Run all unit tests:
```bash
go test ./...
```

Integration tests (require DB/Redis):
```bash
go test -tags=integration ./tests/...
```

E2E tests (require a running server + real data):
```bash
go test -tags=e2e ./tests/...
```

Specific service tests:
```bash
go test -v ./internal/service/ai_planner/...
```

## 🏗️ Architecture
- `cmd/server`: Server entrypoint.
- `cmd/migrate`: Migration helper entrypoint.
- `internal/api/`: Routing, Handlers, and Middlewares.
- `internal/service/`: Business logic (AI Planner, Discovery, Intelligence).
- `internal/repository/`: Data access layer (GORM).
- `internal/cache/`: Redis abstraction.
- `migrations/`: Versioned SQL migrations.

---
*Built for the A2SV African Tourism Project. Mobile-First • Africa-First.*
