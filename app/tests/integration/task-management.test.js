// @ts-check
import { test, expect } from '@playwright/test';

test('task management flow', async ({ page }) => {
  // Enable console logging for debugging
  page.on('console', (msg) => console.log(`BROWSER LOG: ${msg.text()}`));

  // Enable network request logging
  page.on('request', (request) => {
    if (request.url().includes('/api/tasks')) {
      console.log(`REQUEST: ${request.method()} ${request.url()}`);
      console.log(`REQUEST HEADERS:`, request.headers());
      const postData = request.postData();
      if (postData) {
        console.log(`REQUEST DATA: ${postData}`);
      }
    }
  });

  page.on('response', (response) => {
    if (response.url().includes('/api/tasks')) {
      console.log(`RESPONSE: ${response.status()} ${response.url()}`);
      response
        .body()
        .then((body) => {
          try {
            console.log(`RESPONSE BODY: ${body}`);
          } catch (error) {
            console.log(`Failed to log response body: ${error}`);
          }
        })
        .catch((error) => {
          console.log(`Failed to get response body: ${error}`);
        });
    }
  });

  // Step 1: First create a user to assign tasks to
  await page.goto('http://localhost:5174/users/new');
  console.log('Navigated to create user page');

  // Create a test user
  const testUsername = `testuser_${Date.now()}`;
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'password123';

  await page.getByLabel('Username *').fill(testUsername);
  await page.getByLabel('Email *').fill(testEmail);
  await page.getByLabel('Password *').fill(testPassword);

  // Submit the user form
  const userResponsePromise = page.waitForResponse(
    (response) => response.url().includes('/api/users') && response.request().method() === 'POST',
    { timeout: 10000 }
  );

  await page.getByRole('button', { name: 'Create User' }).click();
  console.log('Clicked Create User button');

  try {
    const response = await userResponsePromise;
    console.log(`User creation response status: ${response.status()}`);
    const responseBody = await response.text();
    console.log(`User creation response body: ${responseBody}`);

    if (response.ok()) {
      console.log('User creation was successful');
    } else {
      console.log('User creation failed');
      await page.screenshot({ path: 'debug-user-creation-failed.png' });
    }
  } catch (error) {
    console.log('Error waiting for response:', error);
    await page.screenshot({ path: 'debug-response-error.png' });
  }

  // Wait for navigation to complete and get the user ID
  await page.waitForURL('**/users', { timeout: 10000 });

  // Click on the new user to get their ID
  await page.locator(`text=${testUsername}`).click();

  // Get the user ID from the URL
  const url = page.url();
  const userId = url.split('/').pop();
  console.log(`User ID: ${userId}`);

  // Step 2: Navigate to the Tasks page
  await page.goto('http://localhost:5174/tasks');
  console.log('Navigated to tasks page');

  // Verify we're on the Tasks page
  await expect(page.locator('h1')).toContainText('Tasks');

  // Step 3: Verify that the task list exists (count initial tasks)
  const initialTaskCount = await page.locator('a[href^="/tasks/"]').count();
  console.log(`Initial task count: ${initialTaskCount}`);

  // Step 4: Click the "Add Task" button
  await page.getByRole('link', { name: 'Add Task' }).click();
  console.log('Clicked Add Task button');

  // Verify we're on the Create Task page
  await expect(page.locator('h1')).toContainText('Create New Task');

  // Step 5: Fill out the task form
  const testTaskTitle = `Test Task ${Date.now()}`;
  const testTaskDescription = `This is a test task description created at ${new Date().toISOString()}`;

  await page.getByLabel('Title').fill(testTaskTitle);
  await page.getByLabel('Description').fill(testTaskDescription);
  await page.getByLabel('Assigned User *').selectOption({ value: userId });
  console.log(`Filled form with title: ${testTaskTitle}, description: ${testTaskDescription}, user: ${userId}`);

  // Step 6: Submit the form
  console.log('About to click Create Task button');

  // Wait for network requests to complete after clicking the button
  const responsePromise = page.waitForResponse(
    (response) => response.url().includes('/api/tasks') && response.request().method() === 'POST',
    { timeout: 10000 }
  );

  await page.getByRole('button', { name: 'Create Task' }).click();
  console.log('Clicked Create Task button');

  try {
    const response = await responsePromise;
    console.log(`Form submission response status: ${response.status()}`);
    const responseBody = await response.text();
    console.log(`Form submission response body: ${responseBody}`);

    if (response.ok()) {
      console.log('Task creation was successful');
    } else {
      console.log('Task creation failed');
      await page.screenshot({ path: 'debug-task-creation-failed.png' });
    }
  } catch (error) {
    console.log('Error waiting for response:', error);
    await page.screenshot({ path: 'debug-response-error.png' });
  }

  // Wait for navigation to complete
  try {
    await page.waitForURL('**/tasks', { timeout: 10000 });
    console.log('Navigation completed');
  } catch (error) {
    console.log('Navigation timeout or error:', error);
    await page.screenshot({ path: 'debug-navigation-error.png' });
    console.log('Current URL:', page.url());
    console.log('Current page h1:', await page.locator('h1').textContent());

    // Try to get any error messages from the page
    const errorMessages = await page.locator('.text-destructive').allTextContents();
    if (errorMessages.length > 0) {
      console.log('Error messages on page:', errorMessages);
    }

    // Manually navigate to the Tasks page to continue the test
    console.log('Manually navigating to Tasks page');
    await page.goto('http://localhost:5174/tasks');
  }

  // Step 7: Verify that the new task appears in the list
  try {
    await expect(page.locator(`text=${testTaskTitle}`)).toBeVisible({
      timeout: 5000,
    });
    console.log('Found new task in the list');

    // Verify task count increased
    const newTaskCount = await page.locator('a[href^="/tasks/"]').count();
    console.log(`New task count: ${newTaskCount}`);
    expect(newTaskCount).toBeGreaterThan(initialTaskCount);

    // Step 8: Click on the new task to view details
    await page.locator(`text=${testTaskTitle}`).click();
    console.log('Clicked on new task');

    // Verify we're on the Task Detail page
    await expect(page.locator('h1')).toContainText('Task Details');

    // Verify task details
    await expect(page.locator('h2')).toContainText(testTaskTitle);
    await expect(page.locator('p')).toContainText(testTaskDescription);

    // Step 9: Edit the task
    await page.getByRole('button', { name: 'Edit Task' }).click();
    console.log('Clicked Edit Task button');

    // Update the task title
    const updatedTaskTitle = `Updated Task ${Date.now()}`;
    await page.getByLabel('Title').fill(updatedTaskTitle);

    // Mark the task as completed
    await page.getByLabel('Completed').check();

    // Save the changes
    await page.getByRole('button', { name: 'Save Changes' }).click();
    console.log('Clicked Save Changes button');

    // Verify the task was updated
    await expect(page.locator('h2')).toContainText(updatedTaskTitle);
    await expect(page.locator('text=Completed')).toBeVisible();

    // Step 10: Delete the task
    // First, accept the confirmation dialog that will appear
    page.on('dialog', (dialog) => dialog.accept());

    // Click the Delete Task button
    await page.getByRole('button', { name: 'Delete Task' }).click();
    console.log('Clicked Delete Task button');

    // Wait for redirection back to Tasks page
    await expect(page.locator('h1')).toContainText('Tasks', { timeout: 10000 });

    // Step 11: Verify the task is no longer in the list
    await expect(page.locator(`text=${updatedTaskTitle}`)).not.toBeVisible({
      timeout: 5000,
    });

    // Verify task count decreased
    const finalTaskCount = await page.locator('a[href^="/tasks/"]').count();
    console.log(`Final task count: ${finalTaskCount}`);
    expect(finalTaskCount).toBeLessThan(newTaskCount);

    // Step 12: Clean up - delete the test user
    await page.goto('http://localhost:5174/users');
    await page.locator(`text=${testUsername}`).click();

    // Click the Delete User button
    await page.getByRole('button', { name: 'Delete User' }).click();
    console.log('Clicked Delete User button');

    // Verify we're back on the Users page
    await expect(page.locator('h1')).toContainText('Users', { timeout: 10000 });

    // Verify the user is no longer in the list
    await expect(page.locator(`text=${testUsername}`)).not.toBeVisible({
      timeout: 5000,
    });
  } catch (error) {
    console.log('Error in verification steps:', error);
    await page.screenshot({ path: 'debug-verification-error.png' });
    throw error;
  }
});
