export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCreateInput {
  username: string;
  email: string;
  password: string;
}

export interface UserUpdateInput {
  username?: string;
  email?: string;
  password?: string;
  is_active?: boolean;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'wip' | 'done' | 'failed';
  user_id: number;
  worker_id: string | null;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskCreateInput {
  title: string;
  description?: string;
  user_id: number;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string;
  status?: 'pending' | 'wip' | 'done' | 'failed';
  user_id?: number;
  worker_id?: string;
  error_message?: string;
}
