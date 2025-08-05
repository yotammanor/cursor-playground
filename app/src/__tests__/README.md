# Frontend Component Unit Tests

This directory contains unit tests for the Task Management Application's frontend components using Vitest and React Testing Library.

## Test Files

- **components/Button.test.tsx**: Tests for the Button UI component
- **components/Card.test.tsx**: Tests for the Card UI component and its subcomponents

## Running Tests

### Prerequisites

1. Make sure you're in the app directory:
   ```
   cd app
   ```

2. Make sure all dependencies are installed:
   ```
   npm install
   ```

### Running All Unit Tests

```bash
npm run test:unit
```

### Running Unit Tests in Watch Mode

```bash
npm run test:unit:watch
```

### Running a Specific Test File

```bash
npx vitest run src/__tests__/components/Button.test.tsx
```

### Running Tests with Coverage Report

```bash
npx vitest run --coverage
```

## Test Structure

Each test file follows a similar structure:

1. **Import Dependencies**: Import the necessary testing libraries and components
2. **Test Suite**: A describe block for the component being tested
3. **Test Cases**: Individual it blocks for each aspect of the component
4. **Assertions**: Verify the expected behavior using expect statements

## Adding New Tests

When adding new tests:

1. Create a new file in the appropriate directory (e.g., `src/__tests__/components/ComponentName.test.tsx`)
2. Import the necessary modules and components
3. Create test cases for different aspects of the component
4. Use appropriate assertions to verify the expected behavior

## Best Practices

- Test both the rendering and behavior of components
- Test different props and states
- Use data-testid attributes for more complex components
- Keep tests focused and isolated
- Use descriptive test names
- Mock external dependencies 