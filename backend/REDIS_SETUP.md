# 🔴 Redis Setup Guide

The Africa Tourism Platform uses Redis for deterministic caching of AI-generated itineraries and rate limiting.

## Choosing a Setup Method

### 1. Docker (Recommended)
This is the fastest way to get Redis running locally without installing platform-specific binaries.

```bash
docker run --name tourism-redis -p 6379:6379 -d redis
```

- **URL for .env**: `redis://localhost:6379`

---

### 2. Windows (WSL2)
Redis is not officially supported on Windows, but works perfectly via WSL.

1. Install WSL: `wsl --install`
2. Open your terminal (Ubuntu) and runs:
   ```bash
   sudo apt update
   sudo apt install redis-server
   sudo service redis-server start
   ```
3. Test connectivity: `redis-cli ping` (should return `PONG`)

---

### 3. macOS (Homebrew)
```bash
brew install redis
brew services start redis
```

---

### 4. Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

## Configuration in .env
Once Redis is running, update your `backend/.env` file:

```env
REDIS_URL=redis://localhost:6379
```

If your Redis requires a password:
```env
REDIS_URL=redis://:password@localhost:6379
```

## Troubleshooting
- **Connection Refused**: Ensure the service is started. Check `ps aux | grep redis`.
- **Protected Mode**: If connecting from another container, ensure `protected-mode no` is set in `redis.conf` or use a network.
