import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MessageSquare, Mail, FileText, Users, Plus } from 'lucide-react';
import { getApiUrl } from '../lib/config-simple';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

const ContextInput = ({ onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      source: 'note',
      content: '',
      bulkEntries: ''
    }
  });

  const watchedSource = watch('source');

  const sourceOptions = [
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
    { value: 'note', label: 'Note', icon: FileText },
    { value: 'meeting', label: 'Meeting', icon: Users },
    { value: 'other', label: 'Other', icon: Plus }
  ];

  const getSourceIcon = (source) => {
    const option = sourceOptions.find(opt => opt.value === source);
    return option ? option.icon : FileText;
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (isBulkMode && data.bulkEntries) {
        // Parse bulk entries (one per line)
        const entries = data.bulkEntries
          .split('\n')
          .map(line => line.trim())
          .filter(Boolean)
          .map(content => ({
            content,
            source: data.source
          }));

        if (entries.length === 0) {
          toast.error('Please enter at least one context entry');
          return;
        }

        // Create bulk entries
        const apiUrl = getApiUrl();
        const response = await fetch(`${apiUrl}/contexts/bulk/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ entries })
        });
        
        if (!response.ok) throw new Error('Failed to create bulk entries');
        toast.success(`Added ${entries.length} context entries`);
      } else {
        // Single entry
        if (!data.content.trim()) {
          toast.error('Please enter some content');
          return;
        }

        const apiUrl = getApiUrl();
        const response = await fetch(`${apiUrl}/contexts/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: data.content.trim(),
            source: data.source
          })
        });
        
        if (!response.ok) throw new Error('Failed to create context entry');
        toast.success('Context entry added');
      }

      reset();
      onSuccess();
    } catch (error) {
      toast.error('Failed to add context entry');
      console.error('Context creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const SourceIcon = getSourceIcon(watchedSource);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={() => setIsBulkMode(false)}
          className={`px-3 py-1 text-sm rounded ${
            !isBulkMode ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Single Entry
        </button>
        <button
          type="button"
          onClick={() => setIsBulkMode(true)}
          className={`px-3 py-1 text-sm rounded ${
            isBulkMode ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Bulk Entry
        </button>
      </div>

      {/* Source Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <SourceIcon className="inline h-4 w-4 mr-1" />
          Source Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {sourceOptions.map((option) => {
            const Icon = option.icon;
            return (
              <label
                key={option.value}
                className={`
                  flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-colors
                  ${watchedSource === option.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <input
                  {...register('source')}
                  type="radio"
                  value={option.value}
                  className="sr-only"
                />
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{option.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Content Input */}
      {!isBulkMode ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            {...register('content', { required: 'Content is required' })}
            rows={6}
            className={`textarea ${errors.content ? 'border-danger-300' : ''}`}
            placeholder={`Enter your ${sourceOptions.find(opt => opt.value === watchedSource)?.label.toLowerCase()} content here...`}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-danger-600">{errors.content.message}</p>
          )}
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bulk Entries (one per line)
          </label>
          <textarea
            {...register('bulkEntries', { required: 'Please enter at least one entry' })}
            rows={8}
            className={`textarea ${errors.bulkEntries ? 'border-danger-300' : ''}`}
            placeholder={`Enter multiple ${sourceOptions.find(opt => opt.value === watchedSource)?.label.toLowerCase()} entries, one per line...`}
          />
          {errors.bulkEntries && (
            <p className="mt-1 text-sm text-danger-600">{errors.bulkEntries.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Each line will be saved as a separate context entry
          </p>
        </div>
      )}

      {/* Example/Help Text */}
      <div className="bg-gray-50 rounded-lg p-3">
        <h4 className="text-sm font-medium text-gray-700 mb-1">Examples:</h4>
        <div className="text-xs text-gray-600 space-y-1">
          {watchedSource === 'email' && (
            <>
              <p>• "Meeting with client tomorrow at 2 PM"</p>
              <p>• "Urgent: Review quarterly report by Friday"</p>
            </>
          )}
          {watchedSource === 'whatsapp' && (
            <>
              <p>• "Can we reschedule the project meeting?"</p>
              <p>• "Don't forget about the presentation next week"</p>
            </>
          )}
          {watchedSource === 'note' && (
            <>
              <p>• "Need to prepare slides for Monday's presentation"</p>
              <p>• "Follow up with marketing team about campaign"</p>
            </>
          )}
          {watchedSource === 'meeting' && (
            <>
              <p>• "Action items from team standup"</p>
              <p>• "Discussed new feature requirements"</p>
            </>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
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
              <span className="ml-2">Adding...</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1" />
              {isBulkMode ? 'Add Entries' : 'Add Entry'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ContextInput;
