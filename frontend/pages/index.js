import { useState, useMemo } from 'react';
import useSWR from 'swr';
import Layout from '../components/Layout';
import TaskList from '../components/TaskList';
import TaskFilters from '../components/TaskFilters';
import TaskStats from '../components/TaskStats';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { filterTasks } from '../lib/utils';
import { RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    search: '',
    overdue: false,
  });

  // Fetch tasks
  const { data: tasks, error: tasksError, mutate: mutateTasks, isLoading: tasksLoading } = useSWR('/tasks/');
  const { data: categories, error: categoriesError } = useSWR('/categories/');
  const { data: stats, error: statsError, mutate: mutateStats } = useSWR('/tasks/stats/');

  // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    return filterTasks(tasks, filters);
  }, [tasks, filters]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Handle task updates
  const handleTaskUpdate = () => {
    mutateTasks();
    mutateStats();
  };

  // Handle refresh
  const handleRefresh = () => {
    mutateTasks();
    mutateStats();
  };

  if (tasksError) {
    return (
      <Layout title="Dashboard">
        <ErrorMessage 
          message="Failed to load tasks" 
          error={tasksError}
          onRetry={handleRefresh}
        />
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <TaskStats 
            stats={stats} 
            loading={!stats && !statsError} 
            error={statsError}
          />
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <TaskFilters
              filters={filters}
              categories={categories || []}
              onFilterChange={handleFilterChange}
            />
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRefresh}
                className="btn-secondary btn-sm"
                disabled={tasksLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${tasksLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              <div className="text-sm text-gray-500">
                {filteredTasks.length} of {tasks?.length || 0} tasks
              </div>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {tasksLoading ? (
            <div className="p-8">
              <LoadingSpinner message="Loading tasks..." />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {tasks?.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
              </h3>
              <p className="text-gray-500 mb-4">
                {tasks?.length === 0 
                  ? 'Create your first task to get started with AI-powered task management.'
                  : 'Try adjusting your filters to see more tasks.'
                }
              </p>
              {tasks?.length === 0 && (
                <a href="/tasks/create" className="btn-primary">
                  Create Your First Task
                </a>
              )}
            </div>
          ) : (
            <TaskList 
              tasks={filteredTasks} 
              onTaskUpdate={handleTaskUpdate}
              categories={categories || []}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
