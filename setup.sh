#!/bin/bash

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn langchain langchain_community pydantic python-multipart passlib python-jose[cryptography] bcrypt

# Install frontend dependencies
cd frontend/market-intel-ui
npm install

# Build frontend
npm run build

# Return to root directory
cd ../..

# Start the backend server
echo "Starting the Market Intelligence Agent backend server..."
uvicorn app:app --host 0.0.0.0 --port 8000
