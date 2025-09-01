import { vi } from 'vitest';
import React from 'react';
import '@testing-library/jest-dom';

// Mock React Query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn().mockReturnValue({
    data: [],
    isLoading: false,
    error: null,
  }),
  useMutation: vi.fn().mockReturnValue({
    mutate: vi.fn(),
    isLoading: false,
    error: null,
  }),
  useQueryClient: vi.fn().mockReturnValue({
    invalidateQueries: vi.fn(),
  }),
}));

// Mock React Router
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn().mockReturnValue(vi.fn()),
  useParams: vi.fn().mockReturnValue({}),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) =>
    React.createElement('a', { href: to }, children),
  Routes: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'routes' }, children),
  Route: ({ element }: { element: React.ReactNode }) => React.createElement('div', { 'data-testid': 'route' }, element),
  Outlet: () => React.createElement('div', { 'data-testid': 'outlet' }),
}));
