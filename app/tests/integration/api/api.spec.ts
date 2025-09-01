import { test, expect } from '@playwright/test';

const API_BASE_URL = 'http://localhost:8000';

test.describe('API Endpoints', () => {
  test('should return welcome message on root endpoint', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/`);
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.message).toBe('Welcome to the Task Management API');
  });

  test('should return health status on health endpoint', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/health`);
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.status).toBe('healthy');
  });

  test('should serve API documentation', async ({ page }) => {
    await page.goto(`${API_BASE_URL}/docs`);

    // Check that the Swagger UI loads
    await expect(page).toHaveTitle(/FastAPI - Swagger UI/);

    // Check for some expected elements in the documentation
    await expect(page.locator('h1')).toContainText('Task Management API');
  });

  test('should serve OpenAPI schema', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/openapi.json`);
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.openapi).toBeDefined();
    expect(data.info.title).toBe('Task Management API');
  });
});

test.describe('User Endpoints', () => {
  test('should handle users endpoint', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/users`);
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('should create and retrieve user', async ({ request }) => {
    const userData = {
      email: 'test@example.com',
      username: 'testuser',
      full_name: 'Test User',
      password: 'testpassword123',
    };

    // Create user
    const createResponse = await request.post(`${API_BASE_URL}/api/users`, {
      data: userData,
    });
    expect(createResponse.ok()).toBeTruthy();

    // Retrieve users
    const getResponse = await request.get(`${API_BASE_URL}/api/users`);
    expect(getResponse.ok()).toBeTruthy();

    const users = await getResponse.json();
    const createdUser = users.find((user: { email: string }) => user.email === userData.email);
    expect(createdUser).toBeDefined();
  });

  test('should handle invalid user creation', async ({ request }) => {
    const invalidUserData = {
      email: 'invalid-email',
      username: '',
      full_name: 'Test User',
      password: '123', // too short
    };

    const response = await request.post(`${API_BASE_URL}/api/users`, {
      data: invalidUserData,
    });
    expect(response.status()).toBe(422); // Validation error
  });
});

test.describe('Task Endpoints', () => {
  test('should handle tasks endpoint', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/tasks`);
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('should create and retrieve task', async ({ request }) => {
    // First create a user
    const userData = {
      email: 'taskuser@example.com',
      username: 'taskuser',
      full_name: 'Task User',
      password: 'taskpassword123',
    };

    const userResponse = await request.post(`${API_BASE_URL}/api/users`, {
      data: userData,
    });
    expect(userResponse.ok()).toBeTruthy();

    // Create task
    const taskData = {
      title: 'Test Task',
      description: 'This is a test task',
      status: 'pending',
      priority: 'medium',
    };

    const createResponse = await request.post(`${API_BASE_URL}/api/tasks`, {
      data: taskData,
    });
    expect(createResponse.ok()).toBeTruthy();

    // Retrieve tasks
    const getResponse = await request.get(`${API_BASE_URL}/api/tasks`);
    expect(getResponse.ok()).toBeTruthy();

    const tasks = await getResponse.json();
    const createdTask = tasks.find((task: { title: string }) => task.title === taskData.title);
    expect(createdTask).toBeDefined();
  });
});

test.describe('Error Handling', () => {
  test('should return 404 for non-existent endpoints', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/nonexistent`);
    expect(response.status()).toBe(404);
  });

  test('should handle invalid user ID gracefully', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/users/999999`);
    expect(response.status()).toBe(404);
  });

  test('should handle invalid task ID gracefully', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/tasks/999999`);
    expect(response.status()).toBe(404);
  });
});

test.describe('CORS', () => {
  test('should handle CORS headers properly', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/users`, {
      headers: {
        Origin: 'http://localhost:5173',
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.headers()['access-control-allow-origin']).toBeDefined();
  });
});

test.describe('Performance', () => {
  test('should respond quickly to basic requests', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get(`${API_BASE_URL}/health`);
    const endTime = Date.now();

    expect(response.ok()).toBeTruthy();
    expect(endTime - startTime).toBeLessThan(5000); // Should respond within 5 seconds
  });

  test('should handle concurrent requests', async ({ request }) => {
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(request.get(`${API_BASE_URL}/health`));
    }

    const responses = await Promise.all(promises);
    responses.forEach((response) => {
      expect(response.status()).toBe(200);
    });
  });
});
