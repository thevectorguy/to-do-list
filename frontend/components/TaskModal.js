import { useState } from 'react';
import { X, Edit, Trash2, Brain, Sparkles } from 'lucide-react';
import { taskAPI } from '../lib/api';
import { formatDate, formatRelativeTime, getPriorityClass, isOverdue } from '../lib/utils';
import TaskForm from './TaskForm';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

const TaskModal = ({ task, categories, isOpen, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !task) return null;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSave = async (taskData) => {
    setIsUpdating(true);
    try {
      await taskAPI.updateTask(task.id, taskData);
      toast.success('Task updated successfully!');
      onUpdate();
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update task');
      console.error('Update task error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await taskAPI.deleteTask(task.id);
      toast.success('Task deleted successfully!');
      onUpdate();
      onClose();
    } catch (error) {
      toast.error('Failed to delete task');
      console.error('Delete task error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEnhanceWithAI = async () => {
    setIsEnhancing(true);
    try {
      const response = await taskAPI.enhanceTask(task.id, { apply_suggestions: true });
      toast.success('Task enhanced with AI suggestions!');
      onUpdate();
    } catch (error) {
      toast.error('Failed to enhance task with AI');
      console.error('AI enhancement error:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const categoryName = categories.find(cat => cat.id === task.category)?.name || 'Uncategorized';
  const overdue = isOverdue(task.deadline);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {isEditing ? (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Edit Task</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <TaskForm
              task={task}
              categories={categories}
              onSubmit={handleSave}
              onCancel={handleCancelEdit}
              isSubmitting={isUpdating}
              submitLabel="Update Task"
            />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className={`priority-indicator ${getPriorityClass(task.priority)}`} />
                <h2 className="text-xl font-bold text-gray-900">{task.title}</h2>
                {task.ai_enhanced && (
                  <div className="flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                    <Brain className="h-3 w-3 mr-1" />
                    AI Enhanced
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`
                    inline-block px-3 py-1 rounded-full text-sm font-medium status-${task.status}
                  `}>
                    {task.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <span className={`
                    inline-block px-3 py-1 rounded-full text-sm font-medium
                    ${task.priority >= 75 ? 'bg-danger-100 text-danger-800' :
                      task.priority >= 50 ? 'bg-warning-100 text-warning-800' :
                      task.priority >= 25 ? 'bg-primary-100 text-primary-800' :
                      'bg-success-100 text-success-800'}
                  `}>
                    {task.priority}/100
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <span className="text-gray-900">{categoryName}</span>
                </div>
              </div>

              {/* Description */}
              {task.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
                  </div>
                </div>
              )}

              {/* Original Description (if AI enhanced) */}
              {task.ai_enhanced && task.original_description && task.original_description !== task.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Original Description</label>
                  <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-300">
                    <p className="text-gray-600 text-sm whitespace-pre-wrap">{task.original_description}</p>
                  </div>
                </div>
              )}

              {/* Deadline */}
              {task.deadline && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <div className={`
                    flex items-center space-x-2
                    ${overdue ? 'text-danger-600' : 'text-gray-700'}
                  `}>
                    <span>{formatDate(task.deadline)}</span>
                    {overdue && (
                      <span className="px-2 py-1 bg-danger-100 text-danger-800 text-xs rounded-full">
                        Overdue
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Created:</span> {formatRelativeTime(task.created_at)}
                </div>
                <div>
                  <span className="font-medium">Updated:</span> {formatRelativeTime(task.updated_at)}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                {!task.ai_enhanced && (
                  <button
                    onClick={handleEnhanceWithAI}
                    disabled={isEnhancing}
                    className="btn-secondary btn-sm"
                  >
                    {isEnhancing ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-1" />
                        Enhance with AI
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="btn-danger btn-sm"
                >
                  {isDeleting ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </>
                  )}
                </button>
                <button
                  onClick={handleEdit}
                  className="btn-primary btn-sm"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskModal;
