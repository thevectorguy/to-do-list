import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Brain, Sparkles, Calendar, Tag, AlertCircle } from 'lucide-react';
import { taskAPI } from '../lib/api';
import { validateTask } from '../lib/utils';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

const TaskForm = ({ 
  task = null, 
  categories = [], 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  submitLabel = 'Save Task'
}) => {
  const [isGettingAISuggestions, setIsGettingAISuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      category: task?.category || '',
      priority: task?.priority || 50,
      deadline: task?.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '',
      status: task?.status || 'todo',
      tags: task?.tags?.join(', ') || ''
    }
  });

  const watchedFields = watch();

  // Get AI suggestions
  const getAISuggestions = async () => {
    if (!watchedFields.title.trim()) {
      toast.error('Please enter a task title first');
      return;
    }

    setIsGettingAISuggestions(true);
    try {
      const response = await taskAPI.getAISuggestions({
        task_data: {
          title: watchedFields.title,
          description: watchedFields.description,
          priority: parseInt(watchedFields.priority),
          deadline: watchedFields.deadline || null
        },
        context_limit: 10,
        include_categories: true
      });

      setAiSuggestions(response.data);
      setShowAISuggestions(true);
      
      // Show appropriate message based on AI status
      if (response.data.ai_status === 'fallback') {
        toast.warning(response.data.message || 'Using smart fallback suggestions');
      } else {
        toast.success(response.data.message || 'AI suggestions generated!');
      }
    } catch (error) {
      toast.error('Failed to get AI suggestions');
      console.error('AI suggestions error:', error);
    } finally {
      setIsGettingAISuggestions(false);
    }
  };

  // Apply AI suggestions
  const applyAISuggestion = (field, value) => {
    switch (field) {
      case 'priority':
        setValue('priority', value);
        break;
      case 'deadline':
        if (value) {
          setValue('deadline', new Date(value).toISOString().slice(0, 16));
        }
        break;
      case 'category':
        // Find or create category
        const existingCategory = categories.find(cat => cat.name === value);
        if (existingCategory) {
          setValue('category', existingCategory.id);
        } else {
          // For new categories, we'll handle this in the form submission
          setValue('category', value);
        }
        break;
      case 'tags':
        setValue('tags', value.join(', '));
        break;
      case 'enhanced_description':
        setValue('description', value);
        break;
    }
    toast.success(`Applied AI suggestion for ${field}`);
  };

  // Form submission
  const onFormSubmit = async (data) => {
    const validation = validateTask(data);
    if (!validation.isValid) {
      Object.values(validation.errors).forEach(error => toast.error(error));
      return;
    }

    // Process form data
    const taskData = {
      ...data,
      priority: parseInt(data.priority),
      deadline: data.deadline || null,
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
    };

    // Handle category (if it's a string, it's a new category)
    if (typeof data.category === 'string' && data.category.trim()) {
      taskData.category_name = data.category.trim();
      delete taskData.category;
    } else if (data.category) {
      taskData.category = parseInt(data.category);
    }

    await onSubmit(taskData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Task Title *
        </label>
        <input
          {...register('title', { required: 'Title is required' })}
          type="text"
          className={`input ${errors.title ? 'border-danger-300' : ''}`}
          placeholder="Enter task title..."
        />
        {errors.title && (
          <p className="mt-1 text-sm text-danger-600">{errors.title.message}</p>
        )}
      </div>

      {/* AI Suggestions Button */}
      <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg border border-primary-200">
        <div className="flex items-center">
          <Brain className="h-5 w-5 text-primary-600 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-primary-900">AI Assistant</h3>
            <p className="text-xs text-primary-700">Get smart suggestions for your task</p>
          </div>
        </div>
        <button
          type="button"
          onClick={getAISuggestions}
          disabled={isGettingAISuggestions || !watchedFields.title.trim()}
          className="btn-primary btn-sm"
        >
          {isGettingAISuggestions ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-1" />
              Get AI Suggestions
            </>
          )}
        </button>
      </div>

      {/* AI Suggestions Panel */}
      {showAISuggestions && aiSuggestions && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">AI Suggestions</h3>
            <button
              type="button"
              onClick={() => setShowAISuggestions(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority Suggestion */}
            {aiSuggestions.suggestions.priority !== undefined && (
              <div className="bg-white p-3 rounded border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Priority</span>
                  <button
                    type="button"
                    onClick={() => applyAISuggestion('priority', aiSuggestions.suggestions.priority)}
                    className="text-xs text-primary-600 hover:text-primary-700"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  Suggested: {aiSuggestions.suggestions.priority}/100
                </p>
              </div>
            )}

            {/* Deadline Suggestion */}
            {aiSuggestions.suggestions.deadline && (
              <div className="bg-white p-3 rounded border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Deadline</span>
                  <button
                    type="button"
                    onClick={() => applyAISuggestion('deadline', aiSuggestions.suggestions.deadline)}
                    className="text-xs text-primary-600 hover:text-primary-700"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {new Date(aiSuggestions.suggestions.deadline).toLocaleDateString()}
                </p>
              </div>
            )}

            {/* Category Suggestion */}
            {aiSuggestions.suggestions.category && (
              <div className="bg-white p-3 rounded border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Category</span>
                  <button
                    type="button"
                    onClick={() => applyAISuggestion('category', aiSuggestions.suggestions.category)}
                    className="text-xs text-primary-600 hover:text-primary-700"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {aiSuggestions.suggestions.category}
                </p>
              </div>
            )}

            {/* Tags Suggestion */}
            {aiSuggestions.suggestions.tags && aiSuggestions.suggestions.tags.length > 0 && (
              <div className="bg-white p-3 rounded border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Tags</span>
                  <button
                    type="button"
                    onClick={() => applyAISuggestion('tags', aiSuggestions.suggestions.tags)}
                    className="text-xs text-primary-600 hover:text-primary-700"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {aiSuggestions.suggestions.tags.join(', ')}
                </p>
              </div>
            )}
          </div>

          {/* Enhanced Description */}
          {aiSuggestions.suggestions.enhanced_description && (
            <div className="bg-white p-3 rounded border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Enhanced Description</span>
                <button
                  type="button"
                  onClick={() => applyAISuggestion('enhanced_description', aiSuggestions.suggestions.enhanced_description)}
                  className="text-xs text-primary-600 hover:text-primary-700"
                >
                  Apply
                </button>
              </div>
              <p className="text-sm text-gray-600">
                {aiSuggestions.suggestions.enhanced_description}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className="textarea"
          placeholder="Describe your task in detail..."
        />
      </div>

      {/* Category and Priority Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Tag className="inline h-4 w-4 mr-1" />
            Category
          </label>
          <select {...register('category')} className="select">
            <option value="">Select category...</option>
            {(categories || []).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority: {watchedFields.priority}
          </label>
          <input
            {...register('priority')}
            type="range"
            min="0"
            max="100"
            step="25"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
        </div>
      </div>

      {/* Deadline and Status Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Deadline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="inline h-4 w-4 mr-1" />
            Deadline
          </label>
          <input
            {...register('deadline')}
            type="datetime-local"
            className="input"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select {...register('status')} className="select">
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <input
          {...register('tags')}
          type="text"
          className="input"
          placeholder="Enter tags separated by commas..."
        />
        <p className="mt-1 text-xs text-gray-500">
          Separate multiple tags with commas (e.g., urgent, work, meeting)
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" />
              <span className="ml-2">Saving...</span>
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
