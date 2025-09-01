import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Users from './pages/Users';
import Tasks from './pages/Tasks';
import UserDetail from './pages/UserDetail';
import UserCreate from './pages/UserCreate';
import TaskDetail from './pages/TaskDetail';
import TaskCreate from './pages/TaskCreate';
import NotFound from './pages/NotFound';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="users" element={<Users />} />
          <Route path="users/new" element={<UserCreate />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="tasks/new" element={<TaskCreate />} />
          <Route path="tasks/:id" element={<TaskDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
