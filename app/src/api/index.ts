import axios from 'axios';
import { z } from 'zod';
import { User, UserCreateInput, UserUpdateInput, Task, TaskCreateInput, TaskUpdateInput } from '../types';

// Zod schemas for validation
const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

const UserCreateSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const UserUpdateSchema = z.object({
  username: z.string().min(1, 'Username is required').optional(),
  email: z.string().email('Invalid email format').optional(),
  password: z.string().optional(),
  is_active: z.boolean().optional(),
});

const TaskSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed']),
  due_date: z.string().optional(),
  user_id: z.number(),
  assignee_name: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

const TaskCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed']).default('pending'),
  due_date: z.string().optional(),
  user_id: z.number(),
});

const TaskUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed']).optional(),
  due_date: z.string().optional(),
  user_id: z.number().optional(),
});

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to validate API responses
const validateResponse = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map((e) => e.message).join(', ')}`);
    }
    throw error;
  }
};

// User API
export const getUsers = async (): Promise<User[]> => {
  const response = await api.get('/users');
  const users = z.array(UserSchema).parse(response.data);
  return users;
};

export const getUser = async (id: number): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return validateResponse(UserSchema, response.data);
};

export const createUser = async (userData: UserCreateInput): Promise<User> => {
  // Validate input data
  const validatedData = UserCreateSchema.parse(userData);
  const response = await api.post('/users', validatedData);
  return validateResponse(UserSchema, response.data);
};

export const updateUser = async (id: number, userData: UserUpdateInput): Promise<User> => {
  // Validate input data
  const validatedData = UserUpdateSchema.parse(userData);
  const response = await api.put(`/users/${id}`, validatedData);
  return validateResponse(UserSchema, response.data);
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};

// Task API
export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get('/tasks');
  const tasks = z.array(TaskSchema).parse(response.data);
  return tasks;
};

export const getTask = async (id: number): Promise<Task> => {
  const response = await api.get(`/tasks/${id}`);
  return validateResponse(TaskSchema, response.data);
};

export const getUserTasks = async (userId: number): Promise<Task[]> => {
  const response = await api.get(`/tasks/user/${userId}`);
  const tasks = z.array(TaskSchema).parse(response.data);
  return tasks;
};

export const createTask = async (taskData: TaskCreateInput): Promise<Task> => {
  // Validate input data
  const validatedData = TaskCreateSchema.parse(taskData);
  const response = await api.post('/tasks', validatedData);
  return validateResponse(TaskSchema, response.data);
};

export const updateTask = async (id: number, taskData: TaskUpdateInput): Promise<Task> => {
  // Validate input data
  const validatedData = TaskUpdateSchema.parse(taskData);
  const response = await api.put(`/tasks/${id}`, validatedData);
  return validateResponse(TaskSchema, response.data);
};

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};
