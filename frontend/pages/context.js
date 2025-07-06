import { useState } from 'react';
import useSWR from 'swr';
import Layout from '../components/Layout';
import ContextInput from '../components/ContextInput';
import ContextList from '../components/ContextList';
import { taskAPI } from '../lib/api';
import { MessageSquare, Plus, Brain } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContextPage() {
  const [showInput, setShowInput] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Fetch context entries
  const { data: contexts, error, mutate, isLoading } = useSWR('/contexts/');

  const handleContextAdded = () => {
    mutate();
    setShowInput(false);
    toast.success('Context entry added successfully!');
  };

  const handleAnalyzeContext = async () => {
    if (!contexts || contexts.length === 0) {
      toast.error('No context entries to analyze');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await taskAPI.analyzeContext({
        context_entries: contexts.slice(0, 10).map(entry => ({
          content: entry.content,
          source: entry.source
        }))
      });

      setAnalysisResult(response.data.analysis);
      toast.success('Context analysis completed!');
    } catch (error) {
      toast.error('Failed to analyze context');
      console.error('Context analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout title="Daily Context">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Daily Context</h1>
            <p className="text-gray-600 mt-1">
              Add your daily messages, emails, and notes to help AI understand your priorities.
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button
              onClick={handleAnalyzeContext}
              disabled={isAnalyzing || !contexts?.length}
              className="btn-secondary"
            >
              <Brain className={`h-4 w-4 mr-1 ${isAnalyzing ? 'animate-spin' : ''}`} />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Context'}
            </button>
            <button
              onClick={() => setShowInput(true)}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Context
            </button>
          </div>
        </div>

        {/* Context Analysis Results */}
        {analysisResult && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-primary-900 mb-4">
              <Brain className="inline h-5 w-5 mr-2" />
              AI Context Analysis
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Summary */}
              <div>
                <h4 className="font-medium text-primary-800 mb-2">Summary</h4>
                <p className="text-sm text-primary-700">{analysisResult.summary}</p>
              </div>

              {/* Key Themes */}
              {analysisResult.key_themes && analysisResult.key_themes.length > 0 && (
                <div>
                  <h4 className="font-medium text-primary-800 mb-2">Key Themes</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.key_themes.map((theme, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Urgency Indicators */}
              {analysisResult.urgency_indicators && analysisResult.urgency_indicators.length > 0 && (
                <div>
                  <h4 className="font-medium text-primary-800 mb-2">Urgent Items</h4>
                  <ul className="text-sm text-primary-700 space-y-1">
                    {analysisResult.urgency_indicators.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-warning-500 mr-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Mood/Tone */}
              {analysisResult.mood_tone && (
                <div>
                  <h4 className="font-medium text-primary-800 mb-2">Overall Mood</h4>
                  <span className={`
                    px-3 py-1 rounded-full text-sm font-medium
                    ${analysisResult.mood_tone === 'positive' ? 'bg-success-100 text-success-800' :
                      analysisResult.mood_tone === 'stressed' ? 'bg-danger-100 text-danger-800' :
                      'bg-gray-100 text-gray-800'}
                  `}>
                    {analysisResult.mood_tone}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Context Input Modal */}
        {showInput && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Add Context Entry</h2>
                  <button
                    onClick={() => setShowInput(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                <ContextInput
                  onSuccess={handleContextAdded}
                  onCancel={() => setShowInput(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Context List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                <MessageSquare className="inline h-5 w-5 mr-2" />
                Recent Context Entries
              </h2>
              <span className="text-sm text-gray-500">
                {contexts?.length || 0} entries
              </span>
            </div>
          </div>

          <ContextList
            contexts={contexts}
            loading={isLoading}
            error={error}
            onUpdate={mutate}
          />
        </div>
      </div>
    </Layout>
  );
}
