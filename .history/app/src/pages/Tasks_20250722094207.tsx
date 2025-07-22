import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getTasks } from '@/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: tasks = [], isLoading, error } = useQuery('tasks', getTasks)

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <Button asChild>
          <Link to="/tasks/new">Add Task</Link>
        </Button>
      </div>

      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="search"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="text-center">Loading tasks...</div>
      ) : error ? (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          Error loading tasks: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <Link key={task.id} to={`/tasks/${task.id}`}>
                <Card className="h-full transition-colors hover:bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle>{task.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {task.description || 'No description'}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <span className={`mr-2 h-2 w-2 rounded-full ${task.is_completed ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                        <span className="text-sm">{task.is_completed ? 'Completed' : 'In Progress'}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        User ID: {task.user_id}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground">
              No tasks found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Tasks 