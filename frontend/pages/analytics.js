import { useState } from 'react';
import useSWR from 'swr';
import Layout from '../components/Layout';
import { BarChart3, TrendingUp, Clock, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';
import { formatDate, formatRelativeTime } from '../lib/utils';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('week');

  // Fetch data
  const { data: stats, error: statsError, isLoading: statsLoading } = useSWR('/tasks/stats/');
  const { data: tasks, error: tasksError, isLoading: tasksLoading } = useSWR('/tasks/');
  const { data: categories, error: categoriesError } = useSWR('/categories/');

  // Calculate analytics
  const analytics = tasks ? calculateAnalytics(tasks, categories || []) : null;

  if (statsError || tasksError) {
    return (
      <Layout title="Analytics">
        <ErrorMessage 
          message="Failed to load analytics data" 
          error={statsError || tasksError}
        />
      </Layout>
    );
  }

  return (
    <Layout title="Analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Insights into your task management and productivity patterns.
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="select"
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="quarter">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </div>
        </div>

        {/* Overview Stats */}
        {statsLoading ? (
          <div className="card">
            <LoadingSpinner message="Loading statistics..." />
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_tasks}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-success-100 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-success-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed_tasks}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-warning-100 rounded-lg">
                  <Clock className="h-6 w-6 text-warning-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending_tasks}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-danger-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-danger-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.overdue_tasks}</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Detailed Analytics */}
        {tasksLoading ? (
          <div className="card">
            <LoadingSpinner message="Loading detailed analytics..." />
          </div>
        ) : analytics ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Completion Rate */}
            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Completion Rate</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Overall Progress</span>
                  <span className="text-sm font-medium text-gray-900">
                    {stats?.completion_rate || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-success-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats?.completion_rate || 0}%` }}
                  />
                </div>
                <div className="flex items-center text-sm text-success-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>
                    {stats?.completed_tasks || 0} of {stats?.total_tasks || 0} tasks completed
                  </span>
                </div>
              </div>
            </div>

            {/* Priority Distribution */}
            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Priority Distribution</h2>
              <div className="space-y-3">
                {analytics.priorityDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`
                        w-3 h-3 rounded-full mr-3
                        ${item.priority === 'High' ? 'bg-danger-500' :
                          item.priority === 'Medium-High' ? 'bg-warning-500' :
                          item.priority === 'Medium-Low' ? 'bg-primary-500' :
                          'bg-success-500'}
                      `} />
                      <span className="text-sm text-gray-700">{item.priority}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{item.count}</span>
                      <span className="text-xs text-gray-500">
                        ({item.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Tasks by Category</h2>
              <div className="space-y-3">
                {analytics.categoryBreakdown.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{item.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))}
                {analytics.categoryBreakdown.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No categories found
                  </p>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {analytics.recentTasks.slice(0, 5).map((task, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`
                      w-2 h-2 rounded-full
                      ${task.status === 'done' ? 'bg-success-500' :
                        task.status === 'in_progress' ? 'bg-primary-500' :
                        'bg-gray-400'}
                    `} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatRelativeTime(task.updated_at)}
                      </p>
                    </div>
                  </div>
                ))}
                {analytics.recentTasks.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {/* AI Enhancement Stats */}
        {analytics && (
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">AI Enhancement Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {analytics.aiEnhancedCount}
                </div>
                <div className="text-sm text-gray-600">AI Enhanced Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success-600">
                  {analytics.aiEnhancementRate}%
                </div>
                <div className="text-sm text-gray-600">Enhancement Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning-600">
                  {analytics.avgPriority}
                </div>
                <div className="text-sm text-gray-600">Average Priority</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function calculateAnalytics(tasks, categories) {
  const totalTasks = tasks.length;
  
  // Priority distribution
  const priorityRanges = {
    'High': tasks.filter(t => t.priority >= 75).length,
    'Medium-High': tasks.filter(t => t.priority >= 50 && t.priority < 75).length,
    'Medium-Low': tasks.filter(t => t.priority >= 25 && t.priority < 50).length,
    'Low': tasks.filter(t => t.priority < 25).length,
  };
  
  const priorityDistribution = Object.entries(priorityRanges).map(([priority, count]) => ({
    priority,
    count,
    percentage: totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0
  }));

  // Category breakdown
  const categoryCount = {};
  tasks.forEach(task => {
    const categoryName = categories.find(cat => cat.id === task.category)?.name || 'Uncategorized';
    categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
  });
  
  const categoryBreakdown = Object.entries(categoryCount)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  // Recent tasks (sorted by updated_at)
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 10);

  // AI enhancement stats
  const aiEnhancedCount = tasks.filter(t => t.ai_enhanced).length;
  const aiEnhancementRate = totalTasks > 0 ? Math.round((aiEnhancedCount / totalTasks) * 100) : 0;
  const avgPriority = totalTasks > 0 ? Math.round(tasks.reduce((sum, t) => sum + t.priority, 0) / totalTasks) : 0;

  return {
    priorityDistribution,
    categoryBreakdown,
    recentTasks,
    aiEnhancedCount,
    aiEnhancementRate,
    avgPriority
  };
}
