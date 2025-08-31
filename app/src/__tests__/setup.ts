import '@testing-library/jest-dom'
import React from 'react'

// Mock react-query
vi.mock('react-query', async () => {
  const actual = await vi.importActual('react-query')
  return {
    ...actual,
    useQuery: vi.fn().mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    }),
    useMutation: vi.fn().mockReturnValue({
      mutate: vi.fn(),
      isLoading: false,
      error: null,
    }),
  }
})

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({}),
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => {
      return React.createElement('a', { href: to }, children)
    },
  }
}) 