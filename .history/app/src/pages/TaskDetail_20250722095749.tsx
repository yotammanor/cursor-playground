import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getTask, updateTask, deleteTask } from '@/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const TaskDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const taskId = parseInt(id as string)
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    is_completed: false
  })

  const { data: task, isLoading, error } = useQuery(
    ['task', taskId],
    () => getTask(taskId),
    {
      onSuccess: (data) => {
        setFormData({
          title: data.title,
          description: data.description || '',
          is_completed: data.is_completed
        })
      }
    }
  )

  const updateMutation = useMutation(
    (data) => updateTask(taskId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['task', taskId])
        setIsEditing(false)
      }
    }
  )

  const deleteMutation = useMutation(
    () => deleteTask(taskId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks')
        navigate('/tasks')
      }
    }
  )

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateMutation.mutate(formData)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteMutation.mutate()
    }
  }

  if (isLoading) return <div className="text-center">Loading task...</div>
  if (error) return <div className="rounded-md bg-destructive/15 p-4 text-destructive">Error loading task</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Task Details</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate('/tasks')}>
            Back to Tasks
          </Button>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              Edit Task
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Task' : task.title}</CardTitle>
          {!isEditing && task.description && <CardDescription>{task.description}</CardDescription>}
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="is_completed"
                  name="is_completed"
                  type="checkbox"
                  checked={formData.is_completed}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="is_completed" className="text-sm font-medium">Completed</label>
              </div>
              <div className="flex space-x-2">
                <Button type="submit" disabled={updateMutation.isLoading}>
                  {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div className="flex items-center">
                    <span className={`mr-2 h-2 w-2 rounded-full ${task.is_completed ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                    <span>{task.is_completed ? 'Completed' : 'In Progress'}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">User ID</div>
                  <div>{task.user_id}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Created At</div>
                  <div>{new Date(task.created_at).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Updated At</div>
                  <div>{new Date(task.updated_at).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        {!isEditing && (
          <CardFooter className="flex justify-between">
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isLoading}>
              {deleteMutation.isLoading ? 'Deleting...' : 'Delete Task'}
            </Button>
            <Button asChild>
              <Link to={`/users/${task.user_id}`}>View User</Link>
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

export default TaskDetail 