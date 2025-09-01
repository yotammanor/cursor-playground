# Task Management Frontend

A modern React-based frontend for the Task Management application built with the latest technologies.

## Tech Stack

- **React 19** - Latest React with concurrent features and improved performance
- **TypeScript 5.9** - Enhanced type safety and developer experience
- **Vite 7.x** - Ultra-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Modern component library built on Radix UI
- **React Router v7** - Latest routing solution with improved performance
- **Tanstack Query** - Powerful data fetching and caching library
- **Zod** - TypeScript-first schema validation
- **Yarn 4.x** - Fast, reliable package manager
- **ESLint & Prettier** - Code quality and formatting
- **Node 22.x** - Latest LTS Node.js runtime

## Key Features

### Modern React 19

- **Concurrent Features**: Automatic batching, transitions, and suspense
- **Improved Performance**: Better rendering performance and memory usage
- **Enhanced Developer Experience**: Better error messages and debugging

### TypeScript 5.9

- **Strict Type Checking**: Enhanced type safety across the application
- **Better IntelliSense**: Improved autocomplete and error detection
- **Modern JavaScript Features**: Full support for latest ECMAScript features

### Tanstack Query (React Query v5)

- **Powerful Caching**: Intelligent background updates and cache invalidation
- **Optimistic Updates**: Immediate UI updates with background synchronization
- **Error Handling**: Built-in error boundaries and retry mechanisms
- **DevTools**: Comprehensive debugging tools for data fetching

### Zod Validation

- **Runtime Type Safety**: Validate data at runtime with TypeScript integration
- **API Validation**: Automatic validation of API requests and responses
- **Form Validation**: Type-safe form validation with excellent error messages

### React Router v7

- **Performance**: Improved routing performance with better code splitting
- **Type Safety**: Full TypeScript support with type-safe routing
- **Modern Features**: Support for latest React patterns and concurrent features

## UI Design Decision

This project uses **Shadcn UI** with **Tailwind CSS** for the following reasons:

1. **Modern Component Architecture**: Shadcn UI provides a collection of reusable components built on top of Radix UI primitives, offering excellent accessibility and customizability.

2. **Tailwind CSS Benefits**: Utility-first approach with excellent performance, developer experience, and design system consistency.

3. **Headless Components**: Radix UI primitives provide unstyled, accessible components that handle complex interactions and accessibility concerns, allowing for complete styling control.

4. **Composition Over Configuration**: The component architecture encourages composition, making it easier to build complex UIs from simple building blocks.

5. **TypeScript Integration**: Strong TypeScript support for better developer experience and type safety.

## Setup Instructions

### Prerequisites

- Node.js 22.x or higher
- Yarn 4.x

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Run tests
yarn test:unit

# Run Playwright tests
yarn test
```

## Project Structure

```
app/
├── src/
│   ├── components/
│   │   ├── ui/           # Shadcn UI components
│   │   └── ...           # Custom components
│   ├── pages/            # Route components
│   ├── api/              # API client with Zod validation
│   ├── types/            # TypeScript type definitions
│   ├── lib/              # Utility functions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Entry point with Tanstack Query setup
├── tests/                # Playwright E2E tests
├── src/__tests__/        # Unit tests
└── ...
```

## Development Features

### Data Fetching with Tanstack Query

```typescript
// Example of using Tanstack Query
const {
  data: users,
  isLoading,
  error,
} = useQuery({
  queryKey: ['users'],
  queryFn: getUsers,
  staleTime: 1000 * 60 * 5, // 5 minutes
});
```

### Form Validation with Zod

```typescript
// Example of Zod schema validation
const UserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
});
```

### Type-Safe Routing

```typescript
// Example of type-safe routing with React Router v7
const { id } = useParams<{ id: string }>();
```

## Performance Optimizations

- **Code Splitting**: Automatic route-based code splitting
- **Tree Shaking**: Unused code elimination for smaller bundles
- **Caching**: Intelligent caching with Tanstack Query
- **Optimistic Updates**: Immediate UI feedback with background sync
- **Lazy Loading**: Components and routes loaded on demand

## Testing Strategy

- **Unit Tests**: Vitest for component and utility testing
- **E2E Tests**: Playwright for end-to-end testing
- **Type Testing**: TypeScript for compile-time type checking
- **Runtime Validation**: Zod for runtime data validation

## Contributing

1. Follow the TypeScript strict mode guidelines
2. Use Zod schemas for all data validation
3. Implement proper error boundaries
4. Write tests for new features
5. Follow the established component patterns

## Migration Notes

This project has been upgraded from:

- React 18 → React 19
- React Query v3 → Tanstack Query v5
- React Router v6 → React Router v7
- Vite 5 → Vite 7
- TypeScript 5.2 → TypeScript 5.9
- Added Zod for validation
- Enhanced type safety throughout
