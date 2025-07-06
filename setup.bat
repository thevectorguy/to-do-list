@echo off
echo 🚀 Setting up Smart Todo List Application...

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is required but not installed.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is required but not installed.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Backend Setup
echo 📦 Setting up backend...
cd backend

REM Create virtual environment
python -m venv venv
call venv\Scripts\activate

REM Install Python dependencies
pip install -r requirements.txt

REM Copy environment file
if not exist .env (
    copy .env.example .env
    echo 📝 Created .env file. Please edit it with your configuration.
)

REM Run migrations
python manage.py makemigrations
python manage.py migrate

echo ✅ Backend setup completed

REM Frontend Setup
echo 📦 Setting up frontend...
cd ..\frontend

REM Install Node.js dependencies
npm install

REM Copy environment file
if not exist .env.local (
    copy .env.local.example .env.local
    echo 📝 Created .env.local file.
)

echo ✅ Frontend setup completed

REM Final instructions
echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Configure your .env files:
echo    - backend\.env (database and AI configuration)
echo    - frontend\.env.local (API URL)
echo.
echo 2. Create a superuser for Django admin:
echo    cd backend ^&^& python manage.py createsuperuser
echo.
echo 3. Start the applications:
echo    Backend:  cd backend ^&^& python manage.py runserver
echo    Frontend: cd frontend ^&^& npm run dev
echo.
echo 4. Open http://localhost:3000 in your browser
echo.
echo 📚 For detailed setup instructions, see README.md

pause
