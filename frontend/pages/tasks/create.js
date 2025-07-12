import { useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Layout from '../../components/Layout';
import TaskForm from '../../components/TaskForm';
import { taskAPI } from '../../lib/api';
import toast from 'react-hot-toast';

export default function CreateTask() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch categories for the form
  const { data: categoriesData } = useSWR('/api/categories/');
  const categories = categoriesData?.results || [];

  const handleSubmit = async (taskData) => {
    setIsSubmitting(true);
    try {
      const response = await taskAPI.createTask(taskData);
      toast.success('Task created successfully!');
      router.push('/');
    } catch (error) {
      toast.error('Failed to create task');
      console.error('Create task error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <Layout title="Create New Task">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
          <p className="text-gray-600 mt-1">
            Use AI-powered suggestions to create smarter, more organized tasks.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <TaskForm
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            submitLabel="Create Task"
          />
        </div>
      </div>
    </Layout>
  );
}
