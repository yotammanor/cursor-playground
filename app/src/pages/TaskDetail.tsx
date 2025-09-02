import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { getTask, updateTask, deleteTask } from '../api';
import { TaskUpdateInput } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input, Textarea } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../components/ui/breadcrumb';
import { Separator } from '../components/ui/separator';
import { Trash2, Edit, Save, X, Clock, UserCheck, AlertCircle, CheckCircle } from 'lucide-react';

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
  }>({
    title: '',
    description: '',
  });

  const {
    data: task,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['task', id],
    queryFn: () => getTask(Number(id)),
    enabled: !!id,
    refetchInterval: 1000, // Poll every 1 second
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
  if (error)
    return (
      <Alert variant="destructive" className="max-w-md mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Error loading task. Please try again later.</AlertDescription>
      </Alert>
    );
  if (!task)
    return (
      <Alert variant="destructive" className="max-w-md mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Task not found.</AlertDescription>
      </Alert>
    );

  const handleEdit = () => {
    setFormData({
      title: task.title,
      description: task.description || '',
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
    deleteMutation.mutate(task.id);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="w-4 h-4 mr-2" />;
      case 'wip':
        return <Clock className="w-4 h-4 mr-2" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 mr-2" />;
      default:
        return <Clock className="w-4 h-4 mr-2" />;
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
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/tasks">Tasks</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{task.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Task Details</h1>
        <div className="flex space-x-2">
          {!isEditing ? (
            <>
              <Button onClick={handleEdit} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the task "{task.title}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
            <Label>Current Status</Label>
            <Badge variant={getStatusVariant(task.status)} className="flex items-center">
              {getStatusIcon(task.status)}
              {getStatusText(task.status)}
            </Badge>
          </div>
          <div>
            <Label htmlFor="user_id">Assigned User</Label>
            <p className="text-lg">User ID: {task.user_id}</p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Worker Information Card */}
      {(task.worker_id || task.started_at || task.completed_at || task.error_message) && (
        <Card>
          <CardHeader>
            <CardTitle>Worker Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {task.worker_id && (
              <div>
                <Label>Worker ID</Label>
                <div className="flex items-center">
                  <UserCheck className="w-4 h-4 mr-2 text-blue-600" />
                  <p className="text-lg font-mono">{task.worker_id}</p>
                </div>
              </div>
            )}

            {task.started_at && (
              <div>
                <Label>Started At</Label>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-blue-600" />
                  <p className="text-lg">{new Date(task.started_at).toLocaleString()}</p>
                </div>
              </div>
            )}

            {task.completed_at && (
              <div>
                <Label>Completed At</Label>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  <p className="text-lg">{new Date(task.completed_at).toLocaleString()}</p>
                </div>
              </div>
            )}

            {task.error_message && (
              <div>
                <Label>Error Message</Label>
                <div className="flex items-start">
                  <AlertCircle className="w-4 h-4 mr-2 text-red-600 mt-1" />
                  <p className="text-lg text-red-700 bg-red-50 p-3 rounded border">{task.error_message}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Timestamps Card */}
      <Card>
        <CardHeader>
          <CardTitle>Timestamps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Created At</Label>
            <p className="text-lg">{new Date(task.created_at).toLocaleString()}</p>
          </div>
          <div>
            <Label>Updated At</Label>
            <p className="text-lg">{new Date(task.updated_at).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskDetail;
