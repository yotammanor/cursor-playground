export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface UserCreateInput {
  name: string;
  email: string;
  phone?: string;
}

export interface UserUpdateInput {
  name?: string;
  email?: string;
  phone?: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date?: string;
  user_id: number;
  assignee_name?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskCreateInput {
  title: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed';
  due_date?: string;
  user_id: number;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed';
  due_date?: string;
  user_id?: number;
}
