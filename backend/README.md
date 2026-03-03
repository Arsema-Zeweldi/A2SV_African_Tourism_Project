# 🌍 Africa Tourism Platform - Backend

Welcome to the backend repository for the Africa Tourism Platform. This is a Go-based modular monolith designed for scalability, security, and AI-driven travel intelligence.

## 🚀 Quick Start

### 1. Prerequisites
- **Go**: 1.22+
- **PostgreSQL**: 15+

### 2. Database Setup (Local PostgreSQL)
1. Ensure your local PostgreSQL service is running.
2. Create a database named `africa_tourism`.
3. Apply the initial schema:
   ```bash
    psql -U postgres -d africa_tourism -f migrations/001_init_schema.sql
   ```

### 3. Environment Configuration
Create a `.env` file in this directory (`backend/`) using your local credentials:

```env
SERVER_PORT=8080
DATABASE_URL=postgresql://postgres:<password>@localhost:5432/africa_tourism?sslmode=disable
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
```

Notes:
- `DATABASE_URL` is required for database connectivity.
- `sslmode=disable` is typically used for local development.

### 4. Running the Server
```bash
go mod tidy
go run cmd/main.go
```

## 🏗️ Project Structure
- `cmd/main.go`: Application entry point.
- `internal/api/`: Routing and HTTP handlers.
    - `handlers/`: Request/Response logic.
    - `middleware/`: Auth (JWT), Logging, etc.
- `internal/models/`: GORM database models.
- `internal/database/`: DB connection & auto-migrations.
- `internal/config/`: Environment variable loader.
- `migrations/`: Raw SQL schema definitions.

## 🔐 Authentication & Security
The API uses **JWT (JSON Web Tokens)** for secure access.
- **Register**: `POST /api/v1/auth/register`
- **Login**: `POST /api/v1/auth/login` (returns JWT)
- **Protected Routes**: Include `Authorization: Bearer <your_token>` in the header.

## 🤝 Backend Team Guidelines
- **Branch Strategy**: Work exclusively on the `backend` branch for features and fixes.
- **Commit Messages**: Follow standard semantic commit messages (e.g., `feat: add discovery search logic`).
- **Development**: Ensure all new endpoints are registered in `internal/api/router.go` and follow the established modular structure.

---
*Built with ❤️ for the A2SV African Tourism Project.*
