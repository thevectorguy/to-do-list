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

## 📦 Installation

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL database (Supabase recommended)
- OpenAI API key OR LM Studio setup

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd smart-todo-app/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment configuration**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Django Configuration
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   
   # Database Configuration (Supabase)
   DB_NAME=your_supabase_db_name
   DB_USER=postgres
   DB_PASSWORD=your_supabase_password
   DB_HOST=your_supabase_host
   DB_PORT=5432
   
   # AI Configuration
   OPENAI_API_KEY=your_openai_api_key_here
   # OR
   LOCAL_LLM_URL=http://127.0.0.1:1234/v1/chat/completions
   ```

5. **Database setup**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   ```

6. **Run the server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. **Run the development server**
   ```bash
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
1. Open http://localhost:3000 in your browser
2. Create your first task using the "Add Task" button
3. Add daily context (emails, messages, notes) in the Context page
4. Use AI suggestions to enhance your tasks

### AI Features
- **Smart Task Creation**: Click "Get AI Suggestions" when creating tasks
- **Context Analysis**: Add daily context and click "Analyze Context"
- **Task Enhancement**: Use "Enhance with AI" on existing tasks
- **Priority Intelligence**: AI automatically suggests priority levels
- **Deadline Suggestions**: Get realistic deadline recommendations

### Dashboard Features
- **Task Filtering**: Filter by status, priority, category
- **Search**: Full-text search across all tasks
- **Statistics**: View completion rates and task analytics
- **Quick Actions**: Mark tasks complete, edit, or delete

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

### Backend Deployment (Railway/Heroku)
1. Set environment variables in your hosting platform
2. Configure PostgreSQL database
3. Run migrations: `python manage.py migrate`
4. Collect static files: `python manage.py collectstatic`

### Frontend Deployment (Vercel/Netlify)
1. Set `NEXT_PUBLIC_API_URL` to your backend URL
2. Build: `npm run build`
3. Deploy build files

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
