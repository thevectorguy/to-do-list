#!/bin/bash

# Smart Todo App - Quick Start Script for OpenHands Environment
# This script sets up and runs the complete application

echo "🚀 Starting Smart Todo App Setup..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Setting up Smart Todo App..."

# Backend Setup
print_status "Setting up backend..."
cd backend

# Install Python dependencies
print_status "Installing Python dependencies..."
python -m pip install -r requirements.txt
if [ $? -eq 0 ]; then
    print_success "Python dependencies installed"
else
    print_error "Failed to install Python dependencies"
    exit 1
fi

# Run migrations
print_status "Running database migrations..."
python manage.py makemigrations
python manage.py migrate
if [ $? -eq 0 ]; then
    print_success "Database migrations completed"
else
    print_error "Database migrations failed"
    exit 1
fi

# Start backend server
print_status "Starting backend server on port 12000..."
python manage.py runserver 0.0.0.0:12000 > backend.log 2>&1 &
BACKEND_PID=$!
sleep 3

# Check if backend is running
if ps -p $BACKEND_PID > /dev/null; then
    print_success "Backend server started (PID: $BACKEND_PID)"
else
    print_error "Failed to start backend server"
    exit 1
fi

# Frontend Setup
print_status "Setting up frontend..."
cd ../frontend

# Install Node.js dependencies
print_status "Installing Node.js dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_success "Node.js dependencies installed"
else
    print_error "Failed to install Node.js dependencies"
    exit 1
fi

# Configure environment
print_status "Configuring frontend environment..."
cat > .env.local << EOF
NEXT_PUBLIC_BACKEND_URL=https://work-1-zxnbvxythqwtjtxu.prod-runtime.all-hands.dev
NEXT_PUBLIC_API_URL=https://work-1-zxnbvxythqwtjtxu.prod-runtime.all-hands.dev/api
EOF
print_success "Frontend environment configured"

# Start frontend server
print_status "Starting frontend server on port 12001..."
npm run dev -- --port 12001 --hostname 0.0.0.0 > frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 5

# Check if frontend is running
if ps -p $FRONTEND_PID > /dev/null; then
    print_success "Frontend server started (PID: $FRONTEND_PID)"
else
    print_error "Failed to start frontend server"
    exit 1
fi

# Verify API connection
print_status "Verifying API connection..."
sleep 2
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://work-1-zxnbvxythqwtjtxu.prod-runtime.all-hands.dev/api/)
if [ "$API_RESPONSE" = "200" ]; then
    print_success "API is responding correctly"
else
    print_warning "API response code: $API_RESPONSE"
fi

# Final status
echo ""
echo "🎉 Smart Todo App is now running!"
echo ""
echo "📱 Frontend: https://work-2-zxnbvxythqwtjtxu.prod-runtime.all-hands.dev"
echo "🔧 Backend API: https://work-1-zxnbvxythqwtjtxu.prod-runtime.all-hands.dev/api"
echo ""
echo "📊 Process Information:"
echo "   Backend PID: $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "📝 Log Files:"
echo "   Backend: /workspace/comata9462-project/backend/backend.log"
echo "   Frontend: /workspace/comata9462-project/frontend/frontend.log"
echo ""
echo "🔍 To check logs:"
echo "   Backend: tail -f backend/backend.log"
echo "   Frontend: tail -f frontend/frontend.log"
echo ""
echo "🛑 To stop servers:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
print_success "Setup completed successfully!"