import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser, updateUser, deleteUser, getUserTasks } from '../api';
import { UserUpdateInput } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Trash2, Edit, Save, X, User } from 'lucide-react';

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(Number(id)),
    enabled: !!id,
    refetchInterval: 1000, // Poll every 1 second
  });

  const { data: userTasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['user-tasks', id],
    queryFn: () => getUserTasks(Number(id)),
    enabled: !!id,
    refetchInterval: 1000, // Poll every 1 second
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserUpdateInput }) => updateUser(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['user', id] });
      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] });
      void navigate('/users');
    },
  });

  if (userLoading) return <div className="flex justify-center p-8">Loading user...</div>;
  if (userError) return <div className="flex justify-center p-8 text-red-500">Error loading user</div>;
  if (!user) return <div className="flex justify-center p-8">User not found</div>;

  const handleEdit = () => {
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateMutation.mutate({ id: user.id, data: formData });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(user.id);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'done':
        return 'success';
      case 'wip':
        return 'info';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'done':
        return 'Completed';
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
        <h1 className="text-3xl font-bold">User Details</h1>
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
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            {isEditing ? (
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            ) : (
              <p className="text-lg">{user.username}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            {isEditing ? (
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            ) : (
              <p className="text-lg">{user.email}</p>
            )}
          </div>
          <div>
            <Label htmlFor="is_active">Status</Label>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span className={`text-lg ${user.is_active ? 'text-green-600' : 'text-red-600'}`}>
                {user.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {tasksLoading ? (
            <p>Loading tasks...</p>
          ) : userTasks && userTasks.length > 0 ? (
            <div className="space-y-2">
              {userTasks.map((task) => (
                <div key={task.id} className="p-3 border rounded-lg">
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <Badge variant={getStatusVariant(task.status)} className="mt-2">
                    {getStatusText(task.status)}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No tasks assigned to this user.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetail;
