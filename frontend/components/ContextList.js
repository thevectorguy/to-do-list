import { useState } from 'react';
import { MessageSquare, Mail, FileText, Users, Plus, Trash2, Calendar } from 'lucide-react';
import { formatRelativeTime } from '../lib/utils';
import { taskAPI } from '../lib/api';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const ContextList = ({ contexts, loading, error, onUpdate }) => {
  const [deletingId, setDeletingId] = useState(null);

  const getSourceIcon = (source) => {
    switch (source) {
      case 'email':
        return Mail;
      case 'whatsapp':
        return MessageSquare;
      case 'note':
        return FileText;
      case 'meeting':
        return Users;
      default:
        return Plus;
    }
  };

  const getSourceColor = (source) => {
    switch (source) {
      case 'email':
        return 'text-blue-600 bg-blue-100';
      case 'whatsapp':
        return 'text-green-600 bg-green-100';
      case 'note':
        return 'text-purple-600 bg-purple-100';
      case 'meeting':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this context entry?')) {
      return;
    }

    setDeletingId(id);
    try {
      await taskAPI.deleteContext(id);
      toast.success('Context entry deleted');
      onUpdate();
    } catch (error) {
      toast.error('Failed to delete context entry');
      console.error('Delete context error:', error);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <LoadingSpinner message="Loading context entries..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorMessage 
          message="Failed to load context entries" 
          error={error}
          onRetry={onUpdate}
        />
      </div>
    );
  }

  if (!contexts || contexts.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-400 mb-4">
          <MessageSquare className="mx-auto h-12 w-12" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No context entries yet</h3>
        <p className="text-gray-500 mb-4">
          Start adding your daily messages, emails, and notes to help AI understand your priorities.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {contexts.map((context) => {
        const SourceIcon = getSourceIcon(context.source);
        const sourceColor = getSourceColor(context.source);

        return (
          <div key={context.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start space-x-3">
              {/* Source Icon */}
              <div className={`p-2 rounded-lg ${sourceColor}`}>
                <SourceIcon className="h-4 w-4" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {context.source}
                    </span>
                    {context.processed && (
                      <span className="px-2 py-1 bg-success-100 text-success-800 text-xs rounded-full">
                        Processed
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatRelativeTime(context.created_at)}
                    </div>
                    <button
                      onClick={() => handleDelete(context.id)}
                      disabled={deletingId === context.id}
                      className="text-gray-400 hover:text-danger-600 p-1 rounded"
                      title="Delete entry"
                    >
                      {deletingId === context.id ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed">
                  {context.content}
                </p>

                {/* AI Insights */}
                {context.insights && (
                  <div className="mt-3 p-3 bg-primary-50 rounded-lg border border-primary-200">
                    <h4 className="text-xs font-medium text-primary-800 mb-1">AI Insights</h4>
                    <div className="text-xs text-primary-700">
                      {typeof context.insights === 'string' ? (
                        <p>{context.insights}</p>
                      ) : (
                        <pre className="whitespace-pre-wrap font-sans">
                          {JSON.stringify(context.insights, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContextList;
