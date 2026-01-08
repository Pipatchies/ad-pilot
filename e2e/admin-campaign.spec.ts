import { test, expect } from '@playwright/test';

test.describe('Admin Campaign Flow', () => {
  test('should redirect root to signin', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveURL(/.*(sign-?in|login).*/);
  });

  test('should redirect unauthenticated user trying to access admin', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/dashboard');
    await expect(page).toHaveURL(/.*(sign-?in|login).*/);
  });
});
