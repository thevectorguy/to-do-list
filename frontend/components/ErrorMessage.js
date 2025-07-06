import { AlertTriangle, RefreshCw } from 'lucide-react';
import { getErrorMessage } from '../lib/utils';

const ErrorMessage = ({ message, error, onRetry, className = '' }) => {
  const errorText = message || getErrorMessage(error) || 'An unexpected error occurred';

  return (
    <div className={`
      bg-danger-50 border border-danger-200 rounded-lg p-4
      ${className}
    `}>
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-danger-400 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-danger-800">
            Error
          </h3>
          <p className="mt-1 text-sm text-danger-700">
            {errorText}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 btn-sm bg-danger-100 text-danger-800 hover:bg-danger-200 border-danger-300"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
