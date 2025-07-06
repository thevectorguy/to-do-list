import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.error || 
                          error.response.data?.detail || 
                          `HTTP ${error.response.status}: ${error.response.statusText}`;
      error.message = errorMessage;
    } else if (error.request) {
      // Request was made but no response received
      error.message = 'Network error - please check your connection';
    }
    
    return Promise.reject(error);
  }
);

// API methods
export const taskAPI = {
  // Tasks
  getTasks: (params = {}) => api.get('/tasks/', { params }),
  getTask: (id) => api.get(`/tasks/${id}/`),
  createTask: (data) => api.post('/tasks/', data),
  updateTask: (id, data) => api.put(`/tasks/${id}/`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}/`),
  getOverdueTasks: () => api.get('/tasks/overdue/'),
  getHighPriorityTasks: () => api.get('/tasks/high_priority/'),
  getTaskStats: () => api.get('/tasks/stats/'),
  
  // Categories
  getCategories: () => api.get('/categories/'),
  createCategory: (data) => api.post('/categories/', data),
  getPopularCategories: () => api.get('/categories/popular/'),
  
  // Context
  getContexts: (params = {}) => api.get('/contexts/', { params }),
  createContext: (data) => api.post('/contexts/', data),
  createContextBulk: (data) => api.post('/contexts/bulk_create/', data),
  getRecentContexts: (limit = 10) => api.get(`/contexts/recent/?limit=${limit}`),
  
  // AI Features
  getAISuggestions: (data) => api.post('/ai/suggestions/', data),
  analyzeContext: (data) => api.post('/ai/analyze-context/', data),
  enhanceTask: (taskId, data = {}) => api.post(`/ai/enhance-task/${taskId}/`, data),
  checkAIHealth: () => api.get('/ai/health/'),
};

export default api;
