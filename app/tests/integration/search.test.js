// @ts-check
import { test, expect } from '@playwright/test';

test('search functionality test', async ({ page }) => {
  // Navigate to the users page
  await page.goto('http://localhost:5174/users');

  // Verify the search box exists
  const searchBox = page.getByPlaceholder('Search users...');
  await expect(searchBox).toBeVisible();

  // Enter search term
  await searchBox.fill('test');

  // Verify search results message
  await expect(page.locator('text=No users found matching "test"')).toBeVisible();

  // Clear search
  await searchBox.clear();

  // Navigate to tasks page
  await page.getByRole('link', { name: 'Tasks' }).click();

  // Verify the search box exists
  const taskSearchBox = page.getByPlaceholder('Search tasks...');
  await expect(taskSearchBox).toBeVisible();

  // Enter search term
  await taskSearchBox.fill('test');

  // Verify search results message
  await expect(page.locator('text=No tasks found matching "test"')).toBeVisible();
});
