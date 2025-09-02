import { Outlet, Link } from 'react-router-dom';
import { Button } from './ui/button';

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="text-xl font-bold">Task Management</div>
          <nav className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link to="/">Home</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/users">Users</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/tasks">Tasks</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-screen-2xl px-4 md:px-6 lg:px-8 flex-1 py-6">
        <Outlet />
      </main>
      <footer className="border-t py-4">
        <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Task Management App
        </div>
      </footer>
    </div>
  );
};

export default Layout;
