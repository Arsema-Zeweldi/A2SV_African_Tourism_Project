# 🌍 Africa Tourism Intelligence Platform

> **Africa-First • Budget-Aware • AI-Assisted • Community-Driven**

Welcome to the official monorepo for the **Africa Tourism Intelligence Platform**. This project is designed to bridge the gap in intra-African tourism by providing trusted intelligence, AI-powered planning, and a community-driven marketplace for authentic travel experiences.

---

## 🏗 Project Architecture

This is a professional monorepo structured for scalability and team collaboration.

*   **`apps/mobile`**: 📱 Flutter mobile application (Android/iOS focus).
*   **`apps/web`**: 🌐 Next.js/React web dashboard and portal.
*   **`backend`**: ⚙️ High-performance Go backend (Modular Monolith).
*   **`libs`**: 📦 Shared logic and business domains.
*   **`docs`**: 📖 Project documentation, PRDs, and design specs.
*   **`scripts`**: 🛠 Automation and utility scripts.

---

## 🚀 Getting Started

Quickly set up your development environment:

### 1. Prerequisites
Ensure you have the following installed:
- **Go** (v1.21+)
- **Flutter** (v3.x)
- **Node.js** (v20+)
- **Make** (standard on Linux/macOS)

### 2. Initialization
Run the bootstrap script to verify your environment and install dependencies:
```bash
./scripts/bootstrap.sh
```

### 3. Development Commands
Use the `Makefile` for consistent commands across the team:
- `make setup` - Install all dependencies.
- `make dev-backend` - Start the Go API server.
- `make dev-web` - Spin up the Next.js dev server.
- `make dev-mobile` - Launch the Flutter app.

---

## 🤝 Contribution Guidelines

1. Create a feature branch: `feature/your-cool-feature`.
2. Ensure your code follows the `.editorconfig` rules.
3. Keep the monorepo clean by utilizing the `.gitignore` patterns.

---

*“Built for Africans, by Africans, to explore Africa.”* 🌍✨
