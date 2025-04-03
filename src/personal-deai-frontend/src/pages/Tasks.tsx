
import { useState, useEffect } from 'react';
import { Plus, CheckCircle, Clock, AlertCircle, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Tasks = () => {
  const { actor, isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  useEffect(() => {
    if (isAuthenticated && actor) {
      fetchTasks();
    }
  }, [isAuthenticated, actor]);

  const fetchTasks = async () => {
    if (!actor) return;
    
    setIsLoading(true);
    try {
      const result = await actor.getTasks();
      if ('ok' in result) {
        setTasks(result.ok);
      } else {
        toast.error(`Error fetching tasks: ${result.err}`);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskDescription.trim() || !actor) return;
    
    setIsCreatingTask(true);
    try {
      const result = await actor.createTask(newTaskDescription);
      if ('ok' in result) {
        toast.success('Task created successfully');
        setNewTaskDescription('');
        await fetchTasks();
      } else {
        toast.error(`Error creating task: ${result.err}`);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    } finally {
      setIsCreatingTask(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} className="text-yellow-500" />;
      case 'inProgress':
        return <Loader size={20} className="text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'failed':
        return <AlertCircle size={20} className="text-red-500" />;
      default:
        return <Clock size={20} className="text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'inProgress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Task form */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Create New Task
        </h2>
        <form onSubmit={createTask} className="flex items-start space-x-2">
          <div className="flex-1">
            <textarea
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Describe a task for the AI assistant to complete..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              rows={3}
              disabled={isCreatingTask}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Tasks will be processed autonomously by the on-chain AI assistant.
            </p>
          </div>
          <Button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none"
            disabled={!newTaskDescription.trim() || isCreatingTask}
          >
            {isCreatingTask ? (
              <Loader size={20} className="animate-spin" />
            ) : (
              <>
                <Plus size={20} className="mr-1" />
                Create
              </>
            )}
          </Button>
        </form>
      </div>
      
      {/* Task list */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Your Tasks
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader size={24} className="animate-spin text-purple-600" />
          </div>
        ) : tasks.length > 0 ? (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div 
                key={task.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-800 dark:text-white">{task.description}</h3>
                  <div className="flex items-center space-x-1 text-sm">
                    {getStatusIcon(task.status)}
                    <span className={
                      task.status === 'completed' 
                        ? 'text-green-500' 
                        : task.status === 'failed' 
                          ? 'text-red-500' 
                          : task.status === 'inProgress' 
                            ? 'text-blue-500' 
                            : 'text-yellow-500'
                    }>
                      {getStatusText(task.status)}
                    </span>
                  </div>
                </div>
                
                {task.result && (
                  <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300">
                    <h4 className="font-medium mb-1">Result:</h4>
                    <p>{task.result}</p>
                  </div>
                )}
                
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Created: {new Date(Number(task.created) / 1000000).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300">
              No tasks yet. Create a task to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
