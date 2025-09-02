import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, ExternalLink } from 'lucide-react';

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
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Frontend</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>React 19 with TypeScript</li>
                  <li>Vite 5.x build tool</li>
                  <li>Tailwind CSS v4</li>
                  <li>Shadcn UI components</li>
                  <li>React Query & React Router</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Backend</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Python 3.10</li>
                  <li>FastAPI framework</li>
                  <li>SQLAlchemy ORM</li>
                  <li>Pydantic validation</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <a href="https://github.com/yotammanor/cursor-playground" target="_blank" rel="noopener noreferrer">
                <Github className="w-5 h-5 mr-2" />
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Home;
