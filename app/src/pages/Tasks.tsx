import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, CheckCircle, Circle, User } from 'lucide-react';

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
                  <span
                    className={`px-2 py-1 text-xs rounded-full flex items-center ${
                      task.is_completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {task.is_completed ? <CheckCircle className="w-3 h-3 mr-1" /> : <Circle className="w-3 h-3 mr-1" />}
                    {task.is_completed ? 'Completed' : 'Pending'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{task.description || 'No description'}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <User className="w-4 h-4 mr-1" />
                  <span>User ID: {task.user_id}</span>
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
