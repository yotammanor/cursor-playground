import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
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
    refetchInterval: 1000, // Poll every 1 second
  });

  if (isLoading)
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center p-8 text-red-500">
        <AlertCircle className="h-4 w-4 mr-2" />
        Error loading tasks. Please try again later.
      </div>
    );

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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'done':
        return 'success';
      case 'wip':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
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
            Add Task
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
                  <Badge variant={getStatusVariant(task.status)} className="flex items-center">
                    {getStatusIcon(task.status)}
                    {getStatusText(task.status)}
                  </Badge>
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
