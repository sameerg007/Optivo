#!/bin/bash
# ============================================
# Optivo - Full Stack Startup Script
# Starts both Frontend (Next.js) and Backend (FastAPI)
# ============================================

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
BACKEND_DIR="$SCRIPT_DIR/backend/mutual-funds-api"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}       🚀 Starting Optivo App              ${NC}"
echo -e "${BLUE}============================================${NC}"

# Function to cleanup background processes on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down servers...${NC}"
    kill $(jobs -p) 2>/dev/null
    exit 0
}
trap cleanup SIGINT SIGTERM

# ============================================
# Backend Setup (FastAPI - Mutual Funds API)
# ============================================
echo -e "\n${GREEN}📦 Setting up Backend (Mutual Funds API)...${NC}"
cd "$BACKEND_DIR"

# Create venv if it doesn't exist
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating Python virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate venv and install dependencies
source venv/bin/activate
echo -e "${YELLOW}Installing Python dependencies...${NC}"
pip install -r requirements.txt -q

# Start backend server in background
echo -e "${GREEN}✅ Starting Backend on http://localhost:8000${NC}"
uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# ============================================
# Frontend Setup (Next.js)
# ============================================
echo -e "\n${GREEN}📦 Setting up Frontend (Next.js)...${NC}"
cd "$FRONTEND_DIR"

# Install npm dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing npm dependencies...${NC}"
    npm install
fi

# Start frontend server
echo -e "${GREEN}✅ Starting Frontend on http://localhost:3000${NC}"
npm run dev &
FRONTEND_PID=$!

# ============================================
# Ready!
# ============================================
echo -e "\n${BLUE}============================================${NC}"
echo -e "${GREEN}🎉 Optivo is running!${NC}"
echo -e "${BLUE}============================================${NC}"
echo -e "Frontend:  ${GREEN}http://localhost:3000${NC}"
echo -e "Backend:   ${GREEN}http://localhost:8000${NC}"
echo -e "API Docs:  ${GREEN}http://localhost:8000/docs${NC}"
echo -e "${BLUE}============================================${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}\n"

# Wait for both processes
wait
