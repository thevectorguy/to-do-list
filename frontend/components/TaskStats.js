import { CheckCircle2, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const TaskStats = ({ stats, loading, error }) => {
  if (loading) {
    return (
      <div className="col-span-4">
        <LoadingSpinner message="Loading stats..." />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="col-span-4 text-center text-gray-500">
        <p>Unable to load statistics</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total_tasks,
      icon: Clock,
      color: 'primary',
      description: 'All tasks created'
    },
    {
      title: 'Completed',
      value: stats.completed_tasks,
      icon: CheckCircle2,
      color: 'success',
      description: 'Tasks finished'
    },
    {
      title: 'Pending',
      value: stats.pending_tasks,
      icon: Clock,
      color: 'warning',
      description: 'Tasks in progress'
    },
    {
      title: 'Overdue',
      value: stats.overdue_tasks,
      icon: AlertTriangle,
      color: 'danger',
      description: 'Tasks past deadline'
    }
  ];

  return (
    <>
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="card">
            <div className="flex items-center">
              <div className={`
                p-3 rounded-lg
                ${stat.color === 'primary' ? 'bg-primary-100' :
                  stat.color === 'success' ? 'bg-success-100' :
                  stat.color === 'warning' ? 'bg-warning-100' :
                  'bg-danger-100'}
              `}>
                <Icon className={`
                  h-6 w-6
                  ${stat.color === 'primary' ? 'text-primary-600' :
                    stat.color === 'success' ? 'text-success-600' :
                    stat.color === 'warning' ? 'text-warning-600' :
                    'text-danger-600'}
                `} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-500">{stat.description}</p>
              {stat.title === 'Completed' && stats.total_tasks > 0 && (
                <div className="mt-2">
                  <div className="flex items-center">
                    <TrendingUp className="h-3 w-3 text-success-500 mr-1" />
                    <span className="text-xs text-success-600 font-medium">
                      {stats.completion_rate}% completion rate
                    </span>
                  </div>
                  <div className="mt-1 bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-success-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${stats.completion_rate}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default TaskStats;
