# Africa Tourism Intelligence Platform

> **Africa-First | Budget-Aware | AI-Assisted | Community-Driven**

A full-stack platform bridging the gap in intra-African tourism by providing trusted intelligence, AI-powered planning, and a community-driven marketplace for authentic travel experiences.

## Live Demo

| App | URL |
|-----|-----|
| **Web** | [a2-sv-african-tourism-project-five.vercel.app](https://a2-sv-african-tourism-project-five.vercel.app/) |
| **Backend API** | [africa-tourism-backend.onrender.com](https://africa-tourism-backend.onrender.com) |
| **API Docs** | [Swagger UI](https://africa-tourism-backend.onrender.com/docs/index.html) |

## Project Architecture

This is a monorepo structured for scalability and team collaboration.

```
├── apps/
│   ├── web/          Next.js 16 + React 19 web application
│   └── mobile/       Flutter mobile application (Android/iOS)
├── backend/          Go (Gin + GORM) REST API
├── docs/             PRD, design specs, documentation
├── libs/             Shared logic and business domains
└── scripts/          Automation and utility scripts
```

### Deployment Diagram

```
                      ┌───────────────┐
                      │   Vercel CDN   │
                      │  (Next.js SSR) │
                      └───────┬───────┘
                              │ HTTPS
                              ▼
┌──────────┐          ┌───────────────┐          ┌──────────────┐
│  Client  │◄────────►│  Render.com   │◄────────►│ PostgreSQL   │
│ (Browser)│          │  (Go API)     │          │ (Render DB)  │
└──────────┘          └───────┬───────┘          └──────────────┘
                              │
                     ┌────────┴────────┐
                     │                 │
               ┌─────▼─────┐   ┌──────▼──────┐
               │   Redis    │   │  Cloudinary  │
               │  (Cache)   │   │  (Images)    │
               └───────────┘   └─────────────┘
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui |
| **Backend** | Go 1.25, Gin, GORM, PostgreSQL 16, Redis |
| **AI** | Google Gemini API (itinerary generation) |
| **Auth** | NextAuth.js + JWT, Google OAuth |
| **Maps** | Leaflet.js + react-leaflet |
| **Email** | Brevo (transactional email) |
| **Storage** | Cloudinary (image uploads) |
| **Hosting** | Vercel (web), Render (API + DB) |

## Getting Started

### Prerequisites

- **Go** v1.21+
- **Node.js** v20+
- **Flutter** v3.x (for mobile)
- **Make** (standard on Linux/macOS)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/A2SV/A2SV_African_Tourism_Project.git
cd A2SV_African_Tourism_Project

# 2. Install dependencies
make setup

# 3. Set up environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials

# For the web app:
# Create apps/web/.env.local with:
#   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
#   GOOGLE_CLIENT_ID=<your-google-client-id>
#   GOOGLE_CLIENT_SECRET=<your-google-client-secret>
#   NEXTAUTH_SECRET=<random-secret>
#   NEXTAUTH_URL=http://localhost:3000
```

### Development Commands

```bash
make dev-backend    # Start the Go API server (port 8080)
make dev-web        # Start the Next.js dev server (port 3000)
make dev-mobile     # Launch the Flutter app
make lint           # Run linters across all packages
```

### Web App Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Backend API URL (e.g. `https://africa-tourism-backend.onrender.com`) |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `NEXTAUTH_SECRET` | Yes | Random string for session encryption |
| `NEXTAUTH_URL` | Yes | Canonical URL of the app (e.g. `http://localhost:3000`) |

## Key Features

- **Destination Discovery** — Browse and filter curated African travel packages by category, price, and rating
- **AI Itinerary Generator** — 5-step wizard that generates personalized trip plans using Google Gemini
- **Community Feed** — Share travel experiences with photos, likes, and comments
- **Travel Guides** — Country-specific visa, safety, culture, currency, and transport information
- **Interactive Maps** — Leaflet-powered maps showing activity routes and destinations
- **Package Marketplace** — Publish, browse, and save travel packages with budget filtering
- **Profile & Preferences** — Manage travel preferences, vibes, and account settings

## Contribution Guidelines

1. Create a feature branch from `dev`: `features/{team}/{feature-name}`
2. Follow conventional commits: `feat:`, `fix:`, `docs:`, etc.
3. Open a PR to `dev` — never push directly to `main`
4. See [CONTRIBUTING.md](./CONTRIBUTING.md) for full details

## Team

Built by the A2SV Africa Tourism team.
