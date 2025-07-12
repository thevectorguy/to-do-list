import axios from 'axios';
import { getApiConfig } from './config';

// Create axios instance with dynamic base URL
const createAPI = () => {
  const { apiUrl } = getApiConfig();
  
  return axios.create({
    baseURL: apiUrl,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Get API instance (recreated each time to handle dynamic URLs)
const getAPI = () => createAPI();

// Helper function to setup interceptors for an API instance
const setupInterceptors = (apiInstance) => {
  // Request interceptor
  apiInstance.interceptors.request.use(
    (config) => {
      // Add any auth headers here if needed
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  apiInstance.interceptors.response.use(
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
  
  return apiInstance;
};

// API methods
export const taskAPI = {
  // Generic method for SWR
  get: (url) => {
    const api = setupInterceptors(getAPI());
    // Handle relative URLs by ensuring they start with a slash
    const apiUrl = url.startsWith('/') ? url : `/${url}`;
    return api.get(apiUrl);
  },
  
  // Tasks
  getTasks: (params = {}) => {
    const api = setupInterceptors(getAPI());
    return api.get('/tasks/', { params });
  },
  getTask: (id) => {
    const api = setupInterceptors(getAPI());
    return api.get(`/tasks/${id}/`);
  },
  createTask: (data) => {
    const api = setupInterceptors(getAPI());
    return api.post('/tasks/', data);
  },
  updateTask: (id, data) => {
    const api = setupInterceptors(getAPI());
    return api.put(`/tasks/${id}/`, data);
  },
  deleteTask: (id) => {
    const api = setupInterceptors(getAPI());
    return api.delete(`/tasks/${id}/`);
  },
  getOverdueTasks: () => {
    const api = setupInterceptors(getAPI());
    return api.get('/tasks/overdue/');
  },
  getHighPriorityTasks: () => {
    const api = setupInterceptors(getAPI());
    return api.get('/tasks/high_priority/');
  },
  getTaskStats: () => {
    const api = setupInterceptors(getAPI());
    return api.get('/tasks/stats/');
  },
  
  // Categories
  getCategories: () => {
    const api = setupInterceptors(getAPI());
    return api.get('/categories/');
  },
  createCategory: (data) => {
    const api = setupInterceptors(getAPI());
    return api.post('/categories/', data);
  },
  getPopularCategories: () => {
    const api = setupInterceptors(getAPI());
    return api.get('/categories/popular/');
  },
  
  // Context
  getContexts: (params = {}) => {
    const api = setupInterceptors(getAPI());
    return api.get('/contexts/', { params });
  },
  createContext: (data) => {
    const api = setupInterceptors(getAPI());
    return api.post('/contexts/', data);
  },
  createContextBulk: (data) => {
    const api = setupInterceptors(getAPI());
    return api.post('/contexts/bulk_create/', data);
  },
  getRecentContexts: (limit = 10) => {
    const api = setupInterceptors(getAPI());
    return api.get(`/contexts/recent/?limit=${limit}`);
  },
  
  // AI Features
  getAISuggestions: (data) => {
    const api = setupInterceptors(getAPI());
    return api.post('/ai/suggestions/', data);
  },
  analyzeContext: (data) => {
    const api = setupInterceptors(getAPI());
    return api.post('/ai/analyze-context/', data);
  },
  enhanceTask: (taskId, data = {}) => {
    const api = setupInterceptors(getAPI());
    return api.post(`/ai/enhance-task/${taskId}/`, data);
  },
  checkAIHealth: () => {
    const api = setupInterceptors(getAPI());
    return api.get('/ai/health/');
  },
};

export default getAPI;
