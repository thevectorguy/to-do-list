import { useState } from 'react';
import TaskItem from './TaskItem';
import TaskModal from './TaskModal';

const TaskList = ({ tasks, onTaskUpdate, categories }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleTaskUpdated = () => {
    onTaskUpdate();
    handleModalClose();
  };

  return (
    <>
      <div className="divide-y divide-gray-200">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onClick={() => handleTaskClick(task)}
            onUpdate={onTaskUpdate}
            categories={categories}
          />
        ))}
      </div>

      {/* Task Detail Modal */}
      {isModalOpen && selectedTask && (
        <TaskModal
          task={selectedTask}
          categories={categories}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onUpdate={handleTaskUpdated}
        />
      )}
    </>
  );
};

export default TaskList;
