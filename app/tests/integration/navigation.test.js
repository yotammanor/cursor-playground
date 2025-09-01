// @ts-check
import { test, expect } from '@playwright/test';

test('basic navigation test', async ({ page }) => {
  // Navigate to the home page
  await page.goto('http://localhost:5174/');

  // Verify the page title
  await expect(page).toHaveTitle('Task Management App');

  // Verify the main heading
  await expect(page.locator('h1')).toContainText('Task Management App');

  // Navigate to Users page via navbar
  await page.getByRole('link', { name: 'Users', exact: true }).click();
  await expect(page.url()).toContain('/users');
  await expect(page.locator('h1')).toContainText('Users');

  // Navigate to Tasks page via navbar
  await page.getByRole('link', { name: 'Tasks' }).click();
  await expect(page.url()).toContain('/tasks');
  await expect(page.locator('h1')).toContainText('Tasks');

  // Go back to home page
  await page.getByRole('link', { name: 'Home' }).click();
  await expect(page.url()).toBe('http://localhost:5174/');

  // Navigate to Users page via card button
  await page.getByRole('link', { name: 'Manage Users' }).click();
  await expect(page.url()).toContain('/users');

  // Go back to home page
  await page.getByRole('link', { name: 'Home' }).click();

  // Navigate to Tasks page via card button
  await page.getByRole('link', { name: 'Manage Tasks' }).click();
  await expect(page.url()).toContain('/tasks');
});
