import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getUser, getUserTasks, updateUser, deleteUser } from '@/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const UserDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const userId = parseInt(id as string)
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    is_active: true
  })

  const { data: user, isLoading: userLoading, error: userError } = useQuery(
    ['user', userId],
    () => getUser(userId),
    {
      onSuccess: (data) => {
        setFormData({
          username: data.username,
          email: data.email,
          is_active: data.is_active
        })
      }
    }
  )

  const { data: userTasks, isLoading: tasksLoading } = useQuery(
    ['userTasks', userId],
    () => getUserTasks(userId)
  )

  const updateMutation = useMutation(
    (data) => updateUser(userId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user', userId])
        setIsEditing(false)
      }
    }
  )

  const deleteMutation = useMutation(
    () => deleteUser(userId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
        navigate('/users')
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
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate()
    }
  }

  if (userLoading) return <div className="text-center">Loading user...</div>
  if (userError) return <div className="rounded-md bg-destructive/15 p-4 text-destructive">Error loading user</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate('/users')}>
            Back to Users
          </Button>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              Edit User
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit User' : user.username}</CardTitle>
          {!isEditing && <CardDescription>{user.email}</CardDescription>}
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">Username</label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="is_active"
                  name="is_active"
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="is_active" className="text-sm font-medium">Active</label>
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
                  <div className="text-sm font-medium text-muted-foreground">Username</div>
                  <div>{user.username}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Email</div>
                  <div>{user.email}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div className="flex items-center">
                    <span className={`mr-2 h-2 w-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    <span>{user.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Created At</div>
                  <div>{new Date(user.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        {!isEditing && (
          <CardFooter className="flex justify-between">
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isLoading}>
              {deleteMutation.isLoading ? 'Deleting...' : 'Delete User'}
            </Button>
          </CardFooter>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Tasks</CardTitle>
          <CardDescription>Tasks assigned to this user</CardDescription>
        </CardHeader>
        <CardContent>
          {tasksLoading ? (
            <div className="text-center">Loading tasks...</div>
          ) : userTasks && userTasks.length > 0 ? (
            <div className="space-y-4">
              {userTasks.map((task) => (
                <div key={task.id} className="rounded-md border p-4">
                  <div className="font-medium">{task.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {task.description || 'No description'}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`mr-2 h-2 w-2 rounded-full ${task.is_completed ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                      <span className="text-sm">{task.is_completed ? 'Completed' : 'In Progress'}</span>
                    </div>
                    <Button variant="outline" asChild size="sm">
                      <Link to={`/tasks/${task.id}`}>View Task</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">No tasks assigned to this user</div>
          )}
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link to={`/tasks/new?userId=${userId}`}>Create Task for User</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default UserDetail 