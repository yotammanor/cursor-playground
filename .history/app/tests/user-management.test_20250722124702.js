// @ts-check
import { test, expect } from '@playwright/test';

test('user management flow', async ({ page }) => {
  // Enable console logging for debugging
  page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));
  
  // Step 1: Navigate to the Users page
  await page.goto('http://localhost:5174/users');
  console.log('Navigated to users page');
  
  // Verify we're on the Users page
  await expect(page.locator('h1')).toContainText('Users');
  
  // Step 2: Verify that the user list is empty (or contains only existing users)
  const initialUserCount = await page.locator('a[href^="/users/"]').count();
  console.log(`Initial user count: ${initialUserCount}`);
  
  // Step 3: Click the "Add User" button
  await page.getByRole('link', { name: 'Add User' }).click();
  console.log('Clicked Add User button');
  
  // Verify we're on the Create User page
  await expect(page.locator('h1')).toContainText('Create User');
  
  // Step 4: Fill out the user form
  const testUsername = `testuser_${Date.now()}`;
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'password123';
  
  await page.getByTestId('username-input').fill(testUsername);
  await page.getByTestId('email-input').fill(testEmail);
  await page.getByTestId('password-input').fill(testPassword);
  console.log(`Filled form with username: ${testUsername}, email: ${testEmail}`);
  
  // Step 5: Submit the form
  await page.getByTestId('create-user-button').click();
  console.log('Clicked Create User button');
  
  // Wait for navigation to complete
  try {
    // Wait for navigation or for the Users heading to appear
    await Promise.race([
      page.waitForURL('**/users'),
      page.waitForSelector('h1:has-text("Users")', { timeout: 10000 })
    ]);
    console.log('Navigation completed');
  } catch (error) {
    console.log('Navigation timeout or error:', error);
    // Take a screenshot for debugging
    await page.screenshot({ path: 'debug-navigation-error.png' });
    // Log the current URL
    console.log('Current URL:', page.url());
    // Log the current page content
    console.log('Current page h1:', await page.locator('h1').textContent());
  }
  
  // Wait for redirection back to Users page
  await expect(page.locator('h1')).toContainText('Users', { timeout: 10000 });
  
  // Step 6: Verify that the new user appears in the list
  await expect(page.locator(`text=${testUsername}`)).toBeVisible({ timeout: 5000 });
  
  // Verify user count increased by 1
  const newUserCount = await page.locator('a[href^="/users/"]').count();
  console.log(`New user count: ${newUserCount}`);
  expect(newUserCount).toBe(initialUserCount + 1);
  
  // Step 7: Click on the new user to view details
  await page.locator(`text=${testUsername}`).click();
  console.log('Clicked on new user');
  
  // Verify we're on the User Detail page
  await expect(page.locator('h1')).toContainText('User Details');
  await expect(page.locator('div.grid div:has-text("Username") + div')).toContainText(testUsername);
  await expect(page.locator('div.grid div:has-text("Email") + div')).toContainText(testEmail);
  
  // Step 8: Delete the user
  // First, accept the confirmation dialog that will appear
  page.on('dialog', dialog => dialog.accept());
  
  // Click the Delete User button
  await page.getByRole('button', { name: 'Delete User' }).click();
  console.log('Clicked Delete User button');
  
  // Wait for redirection back to Users page
  await expect(page.locator('h1')).toContainText('Users', { timeout: 10000 });
  
  // Step 9: Verify the user is no longer in the list
  await expect(page.locator(`text=${testUsername}`)).not.toBeVisible({ timeout: 5000 });
  
  // Verify user count is back to initial count
  const finalUserCount = await page.locator('a[href^="/users/"]').count();
  console.log(`Final user count: ${finalUserCount}`);
  expect(finalUserCount).toBe(initialUserCount);
}); 