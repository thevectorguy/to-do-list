import { useState } from 'react';
import useSWR from 'swr';
import Layout from '../components/Layout';
import { Brain, CheckCircle, XCircle, AlertTriangle, RefreshCw, Settings } from 'lucide-react';
import { taskAPI } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function AIHealthPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { data: healthData, error, mutate, isLoading } = useSWR('/ai/health/', {
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await mutate();
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-6 w-6 text-success-600" />;
      case 'degraded':
        return <AlertTriangle className="h-6 w-6 text-warning-600" />;
      default:
        return <XCircle className="h-6 w-6 text-danger-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'degraded':
        return 'warning';
      default:
        return 'danger';
    }
  };

  return (
    <Layout title="AI Health Check">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Health Status</h1>
            <p className="text-gray-600 mt-1">
              Monitor the status and configuration of your AI assistant.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="btn-secondary mt-4 sm:mt-0"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${(isRefreshing || isLoading) ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Health Status Cards */}
        {isLoading ? (
          <div className="card">
            <LoadingSpinner message="Checking AI health..." />
          </div>
        ) : error ? (
          <ErrorMessage 
            message="Failed to check AI health" 
            error={error}
            onRetry={handleRefresh}
          />
        ) : healthData ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overall Status */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Overall Status</h2>
                {getStatusIcon(healthData.status)}
              </div>
              
              <div className={`
                p-4 rounded-lg border-2
                ${healthData.status === 'healthy' ? 'bg-success-50 border-success-200' :
                  healthData.status === 'degraded' ? 'bg-warning-50 border-warning-200' :
                  'bg-danger-50 border-danger-200'}
              `}>
                <div className="flex items-center">
                  <Brain className={`
                    h-8 w-8 mr-3
                    ${healthData.status === 'healthy' ? 'text-success-600' :
                      healthData.status === 'degraded' ? 'text-warning-600' :
                      'text-danger-600'}
                  `} />
                  <div>
                    <h3 className={`
                      text-lg font-medium capitalize
                      ${healthData.status === 'healthy' ? 'text-success-900' :
                        healthData.status === 'degraded' ? 'text-warning-900' :
                        'text-danger-900'}
                    `}>
                      {healthData.status}
                    </h3>
                    <p className={`
                      text-sm
                      ${healthData.status === 'healthy' ? 'text-success-700' :
                        healthData.status === 'degraded' ? 'text-warning-700' :
                        'text-danger-700'}
                    `}>
                      {healthData.status === 'healthy' ? 'AI assistant is working properly' :
                       healthData.status === 'degraded' ? 'AI assistant has limited functionality' :
                       'AI assistant is not responding'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Details */}
              {healthData.error && (
                <div className="mt-4 p-3 bg-danger-50 border border-danger-200 rounded-lg">
                  <h4 className="text-sm font-medium text-danger-800 mb-1">Error Details</h4>
                  <p className="text-sm text-danger-700">{healthData.error}</p>
                </div>
              )}

              {/* Test Response */}
              {healthData.test_response && (
                <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-800 mb-1">Test Response</h4>
                  <p className="text-sm text-gray-700 font-mono">{healthData.test_response}</p>
                </div>
              )}
            </div>

            {/* Configuration */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Configuration</h2>
                <Settings className="h-5 w-5 text-gray-400" />
              </div>

              <div className="space-y-4">
                {/* OpenAI Configuration */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`
                      w-3 h-3 rounded-full mr-3
                      ${healthData.openai_configured ? 'bg-success-500' : 'bg-gray-300'}
                    `} />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">OpenAI API</h3>
                      <p className="text-xs text-gray-600">External AI service</p>
                    </div>
                  </div>
                  <span className={`
                    px-2 py-1 text-xs rounded-full
                    ${healthData.openai_configured 
                      ? 'bg-success-100 text-success-800' 
                      : 'bg-gray-100 text-gray-600'}
                  `}>
                    {healthData.openai_configured ? 'Configured' : 'Not Configured'}
                  </span>
                </div>

                {/* Local LLM Configuration */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`
                      w-3 h-3 rounded-full mr-3
                      ${healthData.local_llm_configured ? 'bg-success-500' : 'bg-gray-300'}
                    `} />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Local LLM</h3>
                      <p className="text-xs text-gray-600">LM Studio or similar</p>
                    </div>
                  </div>
                  <span className={`
                    px-2 py-1 text-xs rounded-full
                    ${healthData.local_llm_configured 
                      ? 'bg-success-100 text-success-800' 
                      : 'bg-gray-100 text-gray-600'}
                  `}>
                    {healthData.local_llm_configured ? 'Configured' : 'Not Configured'}
                  </span>
                </div>

                {/* AI Responsiveness */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`
                      w-3 h-3 rounded-full mr-3
                      ${healthData.ai_responsive ? 'bg-success-500' : 'bg-danger-500'}
                    `} />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">AI Response</h3>
                      <p className="text-xs text-gray-600">Connection test</p>
                    </div>
                  </div>
                  <span className={`
                    px-2 py-1 text-xs rounded-full
                    ${healthData.ai_responsive 
                      ? 'bg-success-100 text-success-800' 
                      : 'bg-danger-100 text-danger-800'}
                  `}>
                    {healthData.ai_responsive ? 'Responsive' : 'Not Responsive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Setup Instructions */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Setup Instructions</h2>
          
          <div className="space-y-6">
            {/* OpenAI Setup */}
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">Option 1: OpenAI API</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Get an API key from <a href="https://platform.openai.com/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">OpenAI Platform</a></li>
                  <li>Add <code className="bg-gray-200 px-1 rounded">OPENAI_API_KEY=your_key_here</code> to your backend .env file</li>
                  <li>Restart the backend server</li>
                </ol>
              </div>
            </div>

            {/* Local LLM Setup */}
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">Option 2: Local LLM (LM Studio)</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Download and install <a href="https://lmstudio.ai/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">LM Studio</a></li>
                  <li>Download a compatible model (e.g., Llama 2, Mistral)</li>
                  <li>Start the local server in LM Studio</li>
                  <li>Add <code className="bg-gray-200 px-1 rounded">LOCAL_LLM_URL=http://127.0.0.1:1234/v1/chat/completions</code> to your backend .env file</li>
                  <li>Restart the backend server</li>
                </ol>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-primary-800 mb-2">💡 Pro Tips</h4>
              <ul className="text-sm text-primary-700 space-y-1">
                <li>• You can configure both options - OpenAI will be used as primary, Local LLM as fallback</li>
                <li>• Local LLM provides privacy and no API costs</li>
                <li>• OpenAI typically provides faster and more accurate responses</li>
                <li>• The system automatically handles failover between configured options</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
