#!/bin/bash

# Install frontend dependencies
cd frontend/market-intel-ui
npm install

# Build frontend
npm run build

# Start frontend dev server in background
npm run dev &

# Return to root directory
cd ../..

# Start the backend server
echo "Starting the Market Intelligence Agent backend server..."
uvicorn app:app --host 0.0.0.0 --port 8000