import { test, expect } from '@playwright/test';

test('Basic setup test', async ({ page }) => {
  await page.goto('https://medlatec-portal-fe.vercel.app/login');
  await expect(page).toHaveTitle(/.*/);
  console.log('Page loaded successfully');
});
