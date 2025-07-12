import { useState } from 'react';
import useSWR from 'swr';
import Layout from '../components/Layout';
import DashboardLoader from '../components/DashboardLoader';
import TaskModal from '../components/TaskModal';
import { RefreshCw, Plus, CheckCircle2, Clock, AlertCircle, Check } from 'lucide-react';

export default function Dashboard() {
  const { data: tasksData, error: tasksError, isLoading: tasksLoading, mutate: mutateTasks } = useSWR('/api/tasks/');
  const { data: stats, error: statsError, mutate: mutateStats } = useSWR('/api/tasks/stats/');

  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tasks = tasksData?.results || [];

  const handleRefresh = () => {
    mutateTasks();
    mutateStats();
  };

  const handleTaskClick = (taskId) => {
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTaskId(null);
    mutateTasks(); // Refresh tasks when modal closes
  };

  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'done' ? 'todo' : 'done';
      const response = await fetch(`/api/tasks/${taskId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        mutateTasks();
        mutateStats();
      } else {
        throw new Error('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    }
  };

  if (tasksLoading) return <DashboardLoader />;
  if (tasksError) return <Layout><div className="p-6 text-red-600">Error: {tasksError.message}</div></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex space-x-2">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <a
              href="/tasks/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </a>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Tasks</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.total_tasks}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.completed_tasks}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.pending_tasks}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Overdue</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.overdue_tasks}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Tasks ({tasks.length})</h2>
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No tasks found</p>
              <a
                href="/tasks/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create your first task
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      {/* Tick Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleComplete(task.id, task.status);
                        }}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          task.status === 'done'
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                        }`}
                        title={task.status === 'done' ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {task.status === 'done' && <Check className="w-4 h-4" />}
                      </button>

                      {/* Task Content - Clickable */}
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => handleTaskClick(task.id)}
                      >
                        <h3 className={`font-medium hover:text-primary-600 ${
                          task.status === 'done' ? 'text-gray-500 line-through' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className={`text-sm mt-1 line-clamp-2 ${
                            task.status === 'done' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            task.status === 'done' ? 'bg-green-100 text-green-800' :
                            task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.status === 'done' ? 'Done' :
                             task.status === 'in_progress' ? 'In Progress' : 'To Do'}
                          </span>
                          <span className="text-xs text-gray-500">
                            Priority: {task.priority_label || task.priority}
                          </span>
                          {task.deadline && (
                            <span className="text-xs text-gray-500">
                              Due: {new Date(task.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      {isModalOpen && selectedTaskId && (
        <TaskModal
          taskId={selectedTaskId}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </Layout>
  );
}