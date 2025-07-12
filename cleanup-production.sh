#!/bin/bash

# Smart Todo App - Production Cleanup Script
# This script removes all unnecessary files for a production-ready environment

echo "🧹 Cleaning up project for production..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[CLEANUP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[REMOVED]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}[ERROR]${NC} Please run this script from the project root directory"
    exit 1
fi

print_status "Starting production cleanup..."

# Remove test files
print_status "Removing test files..."
find . -name "test_*.py" -delete 2>/dev/null && print_success "Python test files"
find . -name "*_test.py" -delete 2>/dev/null && print_success "Python test files (alternative naming)"
find . -name "*.test.js" -delete 2>/dev/null && print_success "JavaScript test files"
find . -name "*.spec.js" -delete 2>/dev/null && print_success "JavaScript spec files"

# Remove log files
print_status "Removing log files..."
find . -name "*.log" -delete 2>/dev/null && print_success "Log files"

# Remove Python cache files
print_status "Removing Python cache files..."
find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null && print_success "Python __pycache__ directories"
find . -name "*.pyc" -delete 2>/dev/null && print_success "Python .pyc files"
find . -name "*.pyo" -delete 2>/dev/null && print_success "Python .pyo files"

# Remove Node.js dependencies and cache
print_status "Removing Node.js dependencies and cache..."
rm -rf frontend/node_modules 2>/dev/null && print_success "node_modules directory"
rm -rf frontend/.next 2>/dev/null && print_success "Next.js cache"
rm -rf frontend/out 2>/dev/null && print_success "Next.js build output"

# Remove development configuration files
print_status "Removing redundant configuration files..."
rm -f frontend/lib/config-env.js 2>/dev/null && print_success "config-env.js"
rm -f frontend/lib/config-simple.js 2>/dev/null && print_success "config-simple.js"
rm -f frontend/lib/fetcher-env.js 2>/dev/null && print_success "fetcher-env.js"
rm -f frontend/lib/fetcher-simple.js 2>/dev/null && print_success "fetcher-simple.js"

# Remove redundant documentation
print_status "Removing redundant documentation..."
rm -f DEPLOYMENT.md 2>/dev/null && print_success "DEPLOYMENT.md"
rm -f RENDER_DEPLOY.md 2>/dev/null && print_success "RENDER_DEPLOY.md"
rm -f CONFIGURATION.md 2>/dev/null && print_success "CONFIGURATION.md"

# Remove development scripts
print_status "Removing development scripts..."
rm -f backend/get-docker.sh 2>/dev/null && print_success "get-docker.sh"
rm -f backend/build.sh 2>/dev/null && print_success "backend/build.sh"
rm -f frontend/build.sh 2>/dev/null && print_success "frontend/build.sh"
rm -f setup.bat 2>/dev/null && print_success "setup.bat"

# Remove temporary files
print_status "Removing temporary files..."
find . -name "*.tmp" -delete 2>/dev/null && print_success "Temporary .tmp files"
find . -name "*.temp" -delete 2>/dev/null && print_success "Temporary .temp files"
find . -name "*.bak" -delete 2>/dev/null && print_success "Backup .bak files"
find . -name "*.backup" -delete 2>/dev/null && print_success "Backup .backup files"

# Remove IDE files
print_status "Removing IDE files..."
rm -rf .vscode 2>/dev/null && print_success ".vscode directory"
rm -rf .idea 2>/dev/null && print_success ".idea directory"
find . -name "*.swp" -delete 2>/dev/null && print_success "Vim swap files"
find . -name "*.swo" -delete 2>/dev/null && print_success "Vim swap files"

# Remove OS files
print_status "Removing OS files..."
find . -name ".DS_Store" -delete 2>/dev/null && print_success "macOS .DS_Store files"
find . -name "Thumbs.db" -delete 2>/dev/null && print_success "Windows Thumbs.db files"

# Show final project structure
print_status "Final project structure:"
echo ""
tree -I 'node_modules|__pycache__|.git|*.pyc|*.log' -L 3 2>/dev/null || find . -type f -not -path '*/.*' | head -20

echo ""
echo -e "${GREEN}✅ Production cleanup completed!${NC}"
echo ""
echo "📁 Cleaned project is ready for:"
echo "   • Version control (git)"
echo "   • Production deployment"
echo "   • Distribution"
echo ""
echo "💡 To set up the application, run: ./quick-start.sh"