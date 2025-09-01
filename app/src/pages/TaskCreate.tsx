import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createTask, getUsers } from '../api';
import { useToast } from '../hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input, Textarea } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

const TaskCreate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    user_id: '',
  });

  // Fetch users for the dropdown
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    refetchInterval: 1000, // Poll every 1 second
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Task created successfully.',
      });
      void queryClient.invalidateQueries({ queryKey: ['tasks'] });
      void navigate('/tasks');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create task. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.user_id) {
      return; // Don't submit if no user selected
    }
    createMutation.mutate({
      ...formData,
      user_id: Number(formData.user_id),
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = formData.title.trim() && formData.user_id;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => void navigate('/tasks')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tasks
        </Button>
        <h1 className="text-3xl font-bold">Create New Task</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" type="text" value={formData.title} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="user_id">Assigned User *</Label>
              <Select
                value={formData.user_id}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, user_id: value }))}
                disabled={usersLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.username} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Error display */}
            {createMutation.error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle className="w-4 h-4" />
                <span>
                  {createMutation.error instanceof Error
                    ? createMutation.error.message
                    : 'Failed to create task. Please try again.'}
                </span>
              </div>
            )}

            <div className="flex space-x-2">
              <Button type="submit" disabled={createMutation.isPending || !isFormValid || usersLoading}>
                <Save className="w-4 h-4 mr-2" />
                {createMutation.isPending ? 'Creating...' : 'Create Task'}
              </Button>
              <Button type="button" variant="outline" onClick={() => void navigate('/tasks')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskCreate;
