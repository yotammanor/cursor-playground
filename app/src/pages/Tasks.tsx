import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, CheckCircle, Circle, User, Clock, UserCheck, AlertCircle } from 'lucide-react';

const Tasks = () => {
  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });

  if (isLoading) return <div className="flex justify-center p-8">Loading tasks...</div>;
  if (error) return <div className="flex justify-center p-8 text-red-500">Error loading tasks</div>;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'wip':
        return <Clock className="w-3 h-3 mr-1" />;
      case 'failed':
        return <AlertCircle className="w-3 h-3 mr-1" />;
      default:
        return <Circle className="w-3 h-3 mr-1" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-800';
      case 'wip':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'done':
        return 'Done';
      case 'wip':
        return 'In Progress';
      case 'failed':
        return 'Failed';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Link to="/tasks/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <Link key={task.id} to={`/tasks/${task.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {task.title}
                  <span className={`px-2 py-1 text-xs rounded-full flex items-center ${getStatusColor(task.status)}`}>
                    {getStatusIcon(task.status)}
                    {getStatusText(task.status)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{task.description || 'No description'}</p>

                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span>User ID: {task.user_id}</span>
                  </div>

                  {task.worker_id && (
                    <div className="flex items-center">
                      <UserCheck className="w-4 h-4 mr-1" />
                      <span>Worker: {task.worker_id}</span>
                    </div>
                  )}

                  {task.started_at && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Started: {new Date(task.started_at).toLocaleString()}</span>
                    </div>
                  )}

                  {task.completed_at && (
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span>Completed: {new Date(task.completed_at).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
