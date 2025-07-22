import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const Home = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Task Management App</h1>
        <p className="text-muted-foreground">
          A full-stack application with React frontend and Python microservices backend.
        </p>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage user accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Create, view, edit, and delete user accounts in the system.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/users">Manage Users</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Manage tasks and assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Create, view, edit, and delete tasks assigned to users.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/tasks">Manage Tasks</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tech Stack</CardTitle>
            <CardDescription>Modern technologies</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1">
              <li>React 18 with TypeScript</li>
              <li>Shadcn UI & Tailwind CSS v4</li>
              <li>FastAPI backend</li>
              <li>SQLAlchemy ORM</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                View Source
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Home 