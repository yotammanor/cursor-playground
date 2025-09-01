import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { getTask, updateTask, deleteTask } from '../api';
import { TaskUpdateInput } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input, Textarea } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Trash2, Edit, Save, X } from 'lucide-react';

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    is_completed: boolean;
  }>({
    title: '',
    description: '',
    is_completed: false,
  });

  const {
    data: task,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['task', id],
    queryFn: () => getTask(Number(id)),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TaskUpdateInput }) => updateTask(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['task', id] });
      void queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks'] });
      void navigate('/tasks');
    },
  });

  if (isLoading) return <div className="flex justify-center p-8">Loading task...</div>;
  if (error) return <div className="flex justify-center p-8 text-red-500">Error loading task</div>;
  if (!task) return <div className="flex justify-center p-8">Task not found</div>;

  const handleEdit = () => {
    setFormData({
      title: task.title,
      description: task.description || '',
      is_completed: task.is_completed,
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateMutation.mutate({ id: task.id, data: formData });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteMutation.mutate(task.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Task Details</h1>
        <div className="flex space-x-2">
          {!isEditing ? (
            <>
              <Button onClick={handleEdit} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button onClick={handleDelete} variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleSave} disabled={updateMutation.isPending}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            {isEditing ? (
              <Input
                id="title"
                value={formData.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            ) : (
              <p className="text-lg">{task.title}</p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            {isEditing ? (
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
              />
            ) : (
              <p className="text-lg">{task.description || 'No description'}</p>
            )}
          </div>
          <div>
            <Label htmlFor="is_completed">Status</Label>
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_completed"
                  checked={formData.is_completed}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, is_completed: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="is_completed">Completed</Label>
              </div>
            ) : (
              <span
                className={`inline-block px-2 py-1 text-sm rounded-full ${
                  task.is_completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {task.is_completed ? 'Completed' : 'Pending'}
              </span>
            )}
          </div>
          <div>
            <Label htmlFor="user_id">Assigned User</Label>
            <p className="text-lg">User ID: {task.user_id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskDetail;
