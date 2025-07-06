import { format, formatDistanceToNow, isAfter, isBefore, parseISO } from 'date-fns';

// Date utilities
export const formatDate = (date, formatStr = 'PPp') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

export const isOverdue = (deadline) => {
  if (!deadline) return false;
  const deadlineDate = typeof deadline === 'string' ? parseISO(deadline) : deadline;
  return isBefore(deadlineDate, new Date());
};

export const isDueSoon = (deadline, hours = 24) => {
  if (!deadline) return false;
  const deadlineDate = typeof deadline === 'string' ? parseISO(deadline) : deadline;
  const soonDate = new Date(Date.now() + hours * 60 * 60 * 1000);
  return isBefore(deadlineDate, soonDate) && isAfter(deadlineDate, new Date());
};

// Priority utilities
export const getPriorityColor = (priority) => {
  if (priority >= 75) return 'danger';
  if (priority >= 50) return 'warning';
  if (priority >= 25) return 'primary';
  return 'success';
};

export const getPriorityLabel = (priority) => {
  if (priority >= 75) return 'High';
  if (priority >= 50) return 'Medium-High';
  if (priority >= 25) return 'Medium-Low';
  return 'Low';
};

export const getPriorityClass = (priority) => {
  if (priority >= 75) return 'priority-high';
  if (priority >= 50) return 'priority-medium-high';
  if (priority >= 25) return 'priority-medium';
  return 'priority-low';
};

// Status utilities
export const getStatusColor = (status) => {
  switch (status) {
    case 'done':
      return 'success';
    case 'in_progress':
      return 'primary';
    case 'todo':
    default:
      return 'gray';
  }
};

export const getStatusLabel = (status) => {
  switch (status) {
    case 'done':
      return 'Done';
    case 'in_progress':
      return 'In Progress';
    case 'todo':
    default:
      return 'To Do';
  }
};

// Task utilities
export const filterTasks = (tasks, filters) => {
  return tasks.filter(task => {
    // Status filter
    if (filters.status && filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }
    
    // Priority filter
    if (filters.priority && filters.priority !== 'all') {
      const priorityRange = getPriorityRange(filters.priority);
      if (task.priority < priorityRange.min || task.priority > priorityRange.max) {
        return false;
      }
    }
    
    // Category filter
    if (filters.category && filters.category !== 'all' && task.category !== parseInt(filters.category)) {
      return false;
    }
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(searchLower);
      const descriptionMatch = task.description.toLowerCase().includes(searchLower);
      const tagsMatch = task.tags.some(tag => tag.toLowerCase().includes(searchLower));
      
      if (!titleMatch && !descriptionMatch && !tagsMatch) {
        return false;
      }
    }
    
    // Overdue filter
    if (filters.overdue && !isOverdue(task.deadline)) {
      return false;
    }
    
    return true;
  });
};

const getPriorityRange = (priority) => {
  switch (priority) {
    case 'high':
      return { min: 75, max: 100 };
    case 'medium-high':
      return { min: 50, max: 74 };
    case 'medium-low':
      return { min: 25, max: 49 };
    case 'low':
      return { min: 0, max: 24 };
    default:
      return { min: 0, max: 100 };
  }
};

// Form utilities
export const validateTask = (task) => {
  const errors = {};
  
  if (!task.title || task.title.trim().length === 0) {
    errors.title = 'Title is required';
  }
  
  if (task.title && task.title.length > 200) {
    errors.title = 'Title must be less than 200 characters';
  }
  
  if (task.deadline) {
    const deadlineDate = new Date(task.deadline);
    if (isNaN(deadlineDate.getTime())) {
      errors.deadline = 'Invalid deadline date';
    }
  }
  
  if (task.priority < 0 || task.priority > 100) {
    errors.priority = 'Priority must be between 0 and 100';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Local storage utilities
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

export const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

// Debounce utility
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Error handling
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.response?.data?.error) return error.response.data.error;
  if (error?.response?.data?.detail) return error.response.data.detail;
  return 'An unexpected error occurred';
};
