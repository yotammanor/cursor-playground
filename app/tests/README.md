# Playwright Tests

This directory contains automated tests for the Task Management application using Playwright.

## Test Files

- `navigation.test.js`: Tests basic navigation through the application
- `search.test.js`: Tests search functionality in the Users and Tasks pages

## Running Tests

To run the tests, make sure both the frontend and backend services are running, then use one of the following commands:

```bash
# Run tests in headless mode
npm test

# Run tests with UI mode
npm run test:ui
```

## Test Structure

Each test file follows a similar structure:

1. Import Playwright test utilities
2. Define test cases with descriptive names
3. Navigate to relevant pages
4. Perform actions (clicks, form inputs)
5. Assert expected outcomes

## Adding New Tests

When adding new tests:

1. Create a new file in the `tests` directory with a descriptive name
2. Import the required Playwright utilities
3. Write test cases that are independent and can run in isolation
4. Focus on testing one specific feature or flow per file

## Test Configuration

Tests are configured in the `playwright.config.js` file at the root of the project. This includes settings for:

- Browser configurations
- Timeouts
- Parallel execution
- Reporting options 