#!/bin/bash

# Smart Todo List Setup Script
echo "🚀 Setting up Smart Todo List Application..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Backend Setup
echo "📦 Setting up backend..."
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Copy environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created .env file. Please edit it with your configuration."
fi

# Run migrations
python manage.py makemigrations
python manage.py migrate

echo "✅ Backend setup completed"

# Frontend Setup
echo "📦 Setting up frontend..."
cd ../frontend

# Install Node.js dependencies
npm install

# Copy environment file
if [ ! -f .env.local ]; then
    cp .env.local.example .env.local
    echo "📝 Created .env.local file."
fi

echo "✅ Frontend setup completed"

# Final instructions
echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Configure your .env files:"
echo "   - backend/.env (database and AI configuration)"
echo "   - frontend/.env.local (API URL)"
echo ""
echo "2. Create a superuser for Django admin:"
echo "   cd backend && python manage.py createsuperuser"
echo ""
echo "3. Start the applications:"
echo "   Backend:  cd backend && python manage.py runserver"
echo "   Frontend: cd frontend && npm run dev"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For detailed setup instructions, see README.md"
