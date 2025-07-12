# Smart Todo List with AI Integration

A full-stack web application that combines intelligent task management with AI-powered features for enhanced productivity. Built with Django REST Framework backend and Next.js frontend.

## 🚀 Features

### Core Functionality
- **Task Management**: Create, edit, delete, and organize tasks
- **Smart Categorization**: Auto-categorize tasks with AI suggestions
- **Priority Management**: AI-powered priority scoring (0-100)
- **Deadline Suggestions**: Intelligent deadline recommendations
- **Status Tracking**: Todo, In Progress, Done status management
- **Tag System**: Flexible tagging for better organization

### AI-Powered Features
- **Context Analysis**: Process daily messages, emails, and notes
- **Task Prioritization**: AI ranks tasks based on urgency and context
- **Smart Descriptions**: Enhanced task descriptions with context-aware details
- **Deadline Intelligence**: Realistic deadline suggestions based on complexity
- **Category Suggestions**: Auto-suggest categories and tags
- **Dual AI Support**: OpenAI API + Local LLM (LM Studio) support

### User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Updates**: Live data synchronization
- **Advanced Filtering**: Filter by status, priority, category, and more
- **Search Functionality**: Full-text search across tasks
- **Dashboard Analytics**: Task completion statistics and insights
- **Dark Mode Ready**: Modern UI with Tailwind CSS

## 🛠 Tech Stack

### Backend
- **Django 4.2.7** - Web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Database (Supabase)
- **OpenAI API** - AI integration
- **LM Studio Support** - Local LLM hosting

### Frontend
- **Next.js 14** - React framework
- **Tailwind CSS** - Styling
- **SWR** - Data fetching and caching
- **React Hook Form** - Form management
- **Lucide React** - Icons

### AI Integration
- **OpenAI GPT-3.5-turbo** - External AI service
- **LM Studio** - Local LLM hosting (recommended)
- **Context Processing** - Daily context analysis
- **Smart Suggestions** - AI-powered task enhancement

## 🏗️ Project Structure

```
comata9462-project/
├── backend/                 # Django REST API
│   ├── ai_module/          # AI processing module
│   ├── tasks/              # Task management app
│   ├── smart_todo/         # Django project settings
│   ├── requirements.txt    # Python dependencies
│   └── manage.py          # Django management script
├── frontend/               # Next.js React application
│   ├── components/         # Reusable React components
│   ├── pages/             # Next.js pages and API routes
│   ├── lib/               # Utility functions and API client
│   ├── styles/            # CSS and styling
│   └── package.json       # Node.js dependencies
├── quick-start.sh         # Automated setup script
├── cleanup-production.sh  # Production cleanup script
└── README.md             # This file
```

## 📦 Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL database (Supabase configured)
- OpenAI API key (already configured)

### Quick Start (OpenHands Environment)

The project is production-ready and pre-configured for the OpenHands runtime environment.

#### **One-Command Setup**
```bash
# Run the automated setup script
./quick-start.sh
```

#### **Manual Setup (if needed)**

1. **Backend Setup**
```bash
cd backend
python -m pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 0.0.0.0:12000 > backend.log 2>&1 &
```

2. **Frontend Setup**
```bash
cd frontend
npm install
echo "NEXT_PUBLIC_BACKEND_URL=https://work-1-zxnbvxythqwtjtxu.prod-runtime.all-hands.dev" > .env.local
echo "NEXT_PUBLIC_API_URL=https://work-1-zxnbvxythqwtjtxu.prod-runtime.all-hands.dev/api" >> .env.local
npm run dev -- --port 12001 --hostname 0.0.0.0 > frontend.log 2>&1 &
```

#### **Access Points**
- **Frontend**: https://work-2-zxnbvxythqwtjtxu.prod-runtime.all-hands.dev
- **Backend API**: https://work-1-zxnbvxythqwtjtxu.prod-runtime.all-hands.dev/api

#### **Production Cleanup**
```bash
# Remove all unnecessary files for production
./cleanup-production.sh
```

### Local Development Setup

For local development outside OpenHands:

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your local configuration

# Setup database
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser

# Run server
python manage.py runserver
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Run development server
npm run dev
```

### AI Setup Options

#### Option 1: OpenAI API (Recommended for production)
1. Get API key from [OpenAI Platform](https://platform.openai.com/)
2. Add to backend `.env`: `OPENAI_API_KEY=your_key_here`
3. Restart backend server

#### Option 2: Local LLM with LM Studio (Privacy-focused)
1. Download [LM Studio](https://lmstudio.ai/)
2. Install a compatible model (Llama 2, Mistral, etc.)
3. Start local server in LM Studio
4. Add to backend `.env`: `LOCAL_LLM_URL=http://127.0.0.1:1234/v1/chat/completions`
5. Restart backend server

## 🎯 Usage

### Getting Started
1. **Access the Application**: Open https://work-2-zxnbvxythqwtjtxu.prod-runtime.all-hands.dev in your browser
2. **Dashboard Overview**: View your task statistics and recent tasks
3. **Create Tasks**: Click "Add Task" to create new tasks with AI assistance
4. **AI Enhancement**: Use "Get AI Suggestions" for smart task creation

### ✅ **Verified Working Features**

#### **Task Management**
- ✅ **Create Tasks**: Add new tasks with title, description, priority, and deadlines
- ✅ **AI Suggestions**: Get intelligent suggestions for priority, category, tags, and descriptions
- ✅ **Task Status**: Track tasks as "To Do", "In Progress", or "Done"
- ✅ **Priority Levels**: Set priority from 0-100 with visual indicators
- ✅ **Categories**: Organize tasks by Work, Personal, etc.
- ✅ **Tags**: Add multiple tags for better organization

#### **AI Features** 
- ✅ **Smart Suggestions**: AI analyzes task titles and provides relevant suggestions
- ✅ **Enhanced Descriptions**: AI generates detailed, context-aware task descriptions
- ✅ **Priority Intelligence**: AI suggests appropriate priority levels (0-100)
- ✅ **Category Detection**: AI recommends suitable categories
- ✅ **Tag Generation**: AI suggests relevant tags for better organization

#### **Dashboard Features**
- ✅ **Task Statistics**: View total, completed, pending, and overdue tasks
- ✅ **Recent Tasks**: See your latest tasks with full details
- ✅ **Real-time Updates**: Dashboard updates immediately after task creation
- ✅ **Navigation**: Easy access to all features via sidebar menu
- ✅ **Responsive Design**: Works on desktop and mobile devices

#### **Technical Features**
- ✅ **API Integration**: Full REST API with Django backend
- ✅ **Database**: PostgreSQL with Supabase hosting
- ✅ **AI Integration**: OpenAI GPT integration for smart suggestions
- ✅ **CORS Support**: Proper cross-origin request handling
- ✅ **Error Handling**: Graceful error handling and user feedback

### **How to Use AI Features**
1. **Create a Task**: Click "Add Task" and enter a task title
2. **Get AI Suggestions**: Click "Get AI Suggestions" button
3. **Apply Suggestions**: Use "Apply" buttons to accept AI recommendations for:
   - Priority level (0-100 scale)
   - Category (Work, Personal, etc.)
   - Tags (relevant keywords)
   - Enhanced description (detailed task breakdown)
4. **Save Task**: Click "Create Task" to save with AI enhancements

## 📊 API Documentation

### Tasks Endpoints
- `GET /api/tasks/` - List all tasks
- `POST /api/tasks/` - Create new task
- `GET /api/tasks/{id}/` - Get specific task
- `PUT /api/tasks/{id}/` - Update task
- `DELETE /api/tasks/{id}/` - Delete task
- `GET /api/tasks/overdue/` - Get overdue tasks
- `GET /api/tasks/stats/` - Get task statistics

### Context Endpoints
- `GET /api/contexts/` - List context entries
- `POST /api/contexts/` - Create context entry
- `POST /api/contexts/bulk_create/` - Create multiple entries

### AI Endpoints
- `POST /api/ai/suggestions/` - Get AI task suggestions
- `POST /api/ai/analyze-context/` - Analyze context entries
- `POST /api/ai/enhance-task/{id}/` - Enhance existing task
- `GET /api/ai/health/` - Check AI service health

## 🧪 Sample Data

### Sample Tasks
```json
{
  "title": "Prepare quarterly presentation",
  "description": "Create slides for Q4 business review meeting",
  "priority": 75,
  "deadline": "2024-01-15T14:00:00Z",
  "category": "Work",
  "tags": ["presentation", "quarterly", "urgent"]
}
```

### Sample Context Entries
```json
{
  "content": "Meeting with client tomorrow at 2 PM to discuss project requirements",
  "source": "email"
}
```

### AI Suggestion Response
```json
{
  "suggestions": {
    "priority": 85,
    "deadline": "2024-01-20T17:00:00Z",
    "category": "Work",
    "tags": ["client", "meeting", "requirements"],
    "enhanced_description": "Prepare for client meeting by reviewing project scope, preparing questions about requirements, and gathering relevant documentation."
  }
}
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
SECRET_KEY=your-django-secret-key
DEBUG=True
DB_NAME=smart_todo
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
OPENAI_API_KEY=your-openai-key
LOCAL_LLM_URL=http://127.0.0.1:1234/v1/chat/completions
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 🚀 Deployment

### Current Deployment Status
- ✅ **Backend**: Running on OpenHands runtime (port 12000)
- ✅ **Frontend**: Running on OpenHands runtime (port 12001)
- ✅ **Database**: PostgreSQL hosted on Supabase
- ✅ **AI Service**: OpenAI API integration active

### Production Deployment

#### Backend Deployment (Railway/Heroku/Render)
1. Set environment variables in your hosting platform
2. Configure PostgreSQL database connection
3. Run migrations: `python manage.py migrate`
4. Collect static files: `python manage.py collectstatic`
5. Configure CORS for your frontend domain

#### Frontend Deployment (Vercel/Netlify)
1. Set `NEXT_PUBLIC_API_URL` to your backend URL
2. Build: `npm run build`
3. Deploy build files
4. Configure environment variables

## 🔧 Troubleshooting

### Common Issues

#### Backend Not Starting
```bash
# Check if port is in use
lsof -i :12000

# Check backend logs
tail -f /workspace/comata9462-project/backend/backend.log

# Restart backend
cd /workspace/comata9462-project/backend
python manage.py runserver 0.0.0.0:12000
```

#### Frontend Not Loading
```bash
# Check frontend logs
tail -f /workspace/comata9462-project/frontend/frontend.log

# Verify environment configuration
cat /workspace/comata9462-project/frontend/.env.local

# Restart frontend
cd /workspace/comata9462-project/frontend
npm run dev -- --port 12001 --hostname 0.0.0.0
```

#### API Connection Issues
```bash
# Test backend API
curl -s https://work-1-zxnbvxythqwtjtxu.prod-runtime.all-hands.dev/api/

# Check CORS configuration
grep -r "CORS" /workspace/comata9462-project/backend/
```

#### Database Connection Issues
```bash
# Test database connection
cd /workspace/comata9462-project/backend
python manage.py dbshell

# Check migrations
python manage.py showmigrations
```

### Environment Variables
Ensure these are properly configured:

#### Backend (.env)
```env
DEBUG=True
SECRET_KEY=django-insecure-1234567890
ALLOWED_HOSTS=*
CORS_ALLOW_ALL_ORIGINS=True
DB_NAME=postgres
DB_USER=postgres.richcxbjrggbdsbeylzx
DB_PASSWORD=thevectorguy123@
DB_HOST=aws-0-ap-south-1.pooler.supabase.com
DB_PORT=6543
OPENAI_API_KEY=sk-proj-...
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_BACKEND_URL=https://work-1-zxnbvxythqwtjtxu.prod-runtime.all-hands.dev
NEXT_PUBLIC_API_URL=https://work-1-zxnbvxythqwtjtxu.prod-runtime.all-hands.dev/api
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for GPT API
- LM Studio for local LLM hosting
- Supabase for database hosting
- Tailwind CSS for styling
- Next.js and Django communities

## 📞 Support

For questions or support, please contact: devgods99@gmail.com

---

**Built with ❤️ for the Full Stack Developer Assignment**
