// @ts-check
const { test, expect } = require('@playwright/test');

test('user management flow', async ({ page }) => {
  // Step 1: Navigate to the Users page
  await page.goto('http://localhost:5174/users');
  
  // Verify we're on the Users page
  await expect(page.locator('h1')).toContainText('Users');
  
  // Step 2: Verify that the user list is empty (or contains only existing users)
  const initialUserCount = await page.locator('a[href^="/users/"]').count();
  
  // Step 3: Click the "Add User" button
  await page.getByRole('link', { name: 'Add User' }).click();
  
  // Verify we're on the Create User page
  await expect(page.locator('h1')).toContainText('Create User');
  
  // Step 4: Fill out the user form
  const testUsername = `testuser_${Date.now()}`;
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'password123';
  
  await page.getByTestId('username-input').fill(testUsername);
  await page.getByTestId('email-input').fill(testEmail);
  await page.getByTestId('password-input').fill(testPassword);
  
  // Step 5: Submit the form
  await page.getByTestId('create-user-button').click();
  
  // Wait for redirection back to Users page
  await expect(page.locator('h1')).toContainText('Users');
  
  // Step 6: Verify that the new user appears in the list
  await expect(page.locator(`text=${testUsername}`)).toBeVisible();
  
  // Verify user count increased by 1
  await expect(page.locator('a[href^="/users/"]')).toHaveCount(initialUserCount + 1);
  
  // Step 7: Click on the new user to view details
  await page.locator(`text=${testUsername}`).click();
  
  // Verify we're on the User Detail page
  await expect(page.locator('h1')).toContainText('User Details');
  await expect(page.locator('div.grid div:has-text("Username") + div')).toContainText(testUsername);
  await expect(page.locator('div.grid div:has-text("Email") + div')).toContainText(testEmail);
  
  // Step 8: Delete the user
  // First, accept the confirmation dialog that will appear
  page.on('dialog', dialog => dialog.accept());
  
  // Click the Delete User button
  await page.getByRole('button', { name: 'Delete User' }).click();
  
  // Wait for redirection back to Users page
  await expect(page.locator('h1')).toContainText('Users');
  
  // Step 9: Verify the user is no longer in the list
  await expect(page.locator(`text=${testUsername}`)).not.toBeVisible();
  
  // Verify user count is back to initial count
  await expect(page.locator('a[href^="/users/"]')).toHaveCount(initialUserCount);
}); 