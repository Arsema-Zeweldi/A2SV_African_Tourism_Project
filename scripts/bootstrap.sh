#!/bin/bash
# 🌍 Africa Tourism Intelligence Platform Bootstrap Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==============================================${NC}"
echo -e "${BLUE}   Africa Tourism Platform - Initial Setup    ${NC}"
echo -e "${BLUE}==============================================${NC}"

# Check for Go
if command -v go &> /dev/null; then
    echo -e "${GREEN}✔ Go is installed: $(go version)${NC}"
else
    echo -e "${RED}✘ Go is not installed. Please install Go 1.21+${NC}"
fi

# Check for Node.js
if command -v node &> /dev/null; then
    echo -e "${GREEN}✔ Node.js is installed: $(node -v)${NC}"
else
    echo -e "${RED}✘ Node.js is not installed. Please install Node.js 20+${NC}"
fi

# Check for Flutter
if command -v flutter &> /dev/null; then
    echo -e "${GREEN}✔ Flutter is installed${NC}"
else
    echo -e "${BLUE}! Flutter is not installed (Optional for backend/web devs)${NC}"
fi

echo -e "\n${BLUE}Installing Backend dependencies...${NC}"
cd backend && go mod tidy && cd ..

echo -e "${GREEN}Done! Use 'make help' to see available commands.${NC}"
