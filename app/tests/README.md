# Playwright Tests for Task Management Application

This directory contains end-to-end tests for the Task Management Application using Playwright.

## Test Files

- **navigation.test.js**: Tests basic navigation flows within the application
- **search.test.js**: Tests search functionality on Users and Tasks pages
- **user-management.test.js**: Tests the complete user management flow (create, view, delete)
- **task-management.test.js**: Tests the complete task management flow (create, view, edit, delete)

## Running Tests

### Prerequisites

1. Make sure the backend API is running on port 8000:
   ```
   cd services/web-api
   uvicorn app.main:app --reload
   ```

2. Make sure the frontend is running on port 5174:
   ```
   cd app
   npm run dev
   ```

### Running All Tests

```bash
cd app
npx playwright test
```

### Running a Specific Test File

```bash
cd app
npx playwright test tests/user-management.test.js
```

### Running Tests with UI Mode

```bash
cd app
npm run test:ui
```

### Viewing Test Reports

After running tests, you can view the HTML report:

```bash
npx playwright show-report
```

## Test Structure

Each test follows a similar structure:

1. **Setup**: Configure event listeners for logging and debugging
2. **Navigation**: Go to the relevant page
3. **Verification**: Check that the page loaded correctly
4. **Actions**: Perform user actions (click, type, etc.)
5. **Assertions**: Verify the expected outcomes

## Debugging Tests

The tests include extensive logging and error handling to help with debugging:

- Console logs from the browser are captured and displayed
- Network requests and responses are logged
- Screenshots are taken on errors
- Detailed error messages are provided

## Adding New Tests

When adding new tests:

1. Create a new file in the `tests` directory
2. Import the necessary Playwright modules
3. Follow the existing test structure
4. Add detailed logging for debugging
5. Use appropriate selectors and assertions

## Best Practices

- Use `data-testid` attributes for stable element selection
- Wait for network requests to complete before making assertions
- Add appropriate timeouts for async operations
- Handle edge cases and error conditions
- Keep tests independent of each other 