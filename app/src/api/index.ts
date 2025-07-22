import axios from 'axios';
import { 
  User, 
  UserCreateInput, 
  UserUpdateInput, 
  Task, 
  TaskCreateInput, 
  TaskUpdateInput 
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API
export const getUsers = async (): Promise<User[]> => {
  const response = await api.get('/users');
  return response.data;
};

export const getUser = async (id: number): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData: UserCreateInput): Promise<User> => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const updateUser = async (id: number, userData: UserUpdateInput): Promise<User> => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};

// Task API
export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get('/tasks');
  return response.data;
};

export const getTask = async (id: number): Promise<Task> => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

export const getUserTasks = async (userId: number): Promise<Task[]> => {
  const response = await api.get(`/tasks/user/${userId}`);
  return response.data;
};

export const createTask = async (taskData: TaskCreateInput): Promise<Task> => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

export const updateTask = async (id: number, taskData: TaskUpdateInput): Promise<Task> => {
  const response = await api.put(`/tasks/${id}`, taskData);
  return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`);
}; 