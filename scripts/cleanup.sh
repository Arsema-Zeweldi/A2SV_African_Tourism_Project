#!/bin/bash
# Clean up build artifacts and dependencies across the monorepo

echo "Cleaning up..."

# Backend
echo "Cleaning backend..."
rm -f backend/backend-bin

# Web
echo "Cleaning web..."
rm -rf apps/web/.next apps/web/node_modules

# Mobile
echo "Cleaning mobile..."
# flutter clean (if flutter is installed)

echo "Done."
