import { useState } from 'react';
import { 
  Calendar, 
  Tag, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Circle,
  Play,
  Brain,
  MoreHorizontal
} from 'lucide-react';
import { formatDate, formatRelativeTime, isOverdue, isDueSoon, getPriorityClass, getStatusColor } from '../lib/utils';
import { taskAPI } from '../lib/api';
import toast from 'react-hot-toast';

const TaskItem = ({ task, onClick, onUpdate, categories }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      await taskAPI.updateTask(task.id, { ...task, status: newStatus });
      toast.success(`Task marked as ${newStatus.replace('_', ' ')}`);
      onUpdate();
    } catch (error) {
      toast.error('Failed to update task status');
      console.error('Status update error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="h-5 w-5 text-success-600" />;
      case 'in_progress':
        return <Play className="h-5 w-5 text-primary-600" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const categoryName = categories.find(cat => cat.id === task.category)?.name || 'Uncategorized';
  const overdue = isOverdue(task.deadline);
  const dueSoon = isDueSoon(task.deadline);

  return (
    <div className={`
      p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer
      ${overdue ? 'border-l-4 border-danger-500 bg-danger-50' : ''}
      ${dueSoon && !overdue ? 'border-l-4 border-warning-500 bg-warning-50' : ''}
    `}>
      <div className="flex items-start space-x-4">
        {/* Status Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            const nextStatus = task.status === 'todo' ? 'in_progress' : 
                             task.status === 'in_progress' ? 'done' : 'todo';
            handleStatusChange(nextStatus);
          }}
          disabled={isUpdating}
          className="mt-1 hover:scale-110 transition-transform duration-200"
        >
          {getStatusIcon(task.status)}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0" onClick={onClick}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Title and Priority */}
              <div className="flex items-center space-x-2 mb-1">
                <h3 className={`
                  text-lg font-medium truncate
                  ${task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-900'}
                `}>
                  {task.title}
                </h3>
                <div className={`priority-indicator ${getPriorityClass(task.priority)}`} />
                {task.ai_enhanced && (
                  <Brain className="h-4 w-4 text-primary-500" title="AI Enhanced" />
                )}
              </div>

              {/* Description */}
              {task.description && (
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {task.description}
                </p>
              )}

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {/* Category */}
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  <span>{categoryName}</span>
                </div>

                {/* Deadline */}
                {task.deadline && (
                  <div className={`
                    flex items-center
                    ${overdue ? 'text-danger-600' : dueSoon ? 'text-warning-600' : ''}
                  `}>
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(task.deadline, 'MMM d, yyyy')}</span>
                    {overdue && <AlertTriangle className="h-4 w-4 ml-1" />}
                  </div>
                )}

                {/* Created Time */}
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{formatRelativeTime(task.created_at)}</span>
                </div>

                {/* Priority Label */}
                <div className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${task.priority >= 75 ? 'bg-danger-100 text-danger-800' :
                    task.priority >= 50 ? 'bg-warning-100 text-warning-800' :
                    task.priority >= 25 ? 'bg-primary-100 text-primary-800' :
                    'bg-success-100 text-success-800'}
                `}>
                  Priority: {task.priority}
                </div>

                {/* Status Badge */}
                <div className={`
                  px-2 py-1 rounded-full text-xs font-medium status-${task.status}
                `}>
                  {task.status.replace('_', ' ').toUpperCase()}
                </div>
              </div>

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                title="View Details"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
