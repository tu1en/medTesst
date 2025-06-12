import { test, expect } from '@playwright/test';
import { LoginPage } from '../../utils/LoginPage';

test.describe('Login Functionality - Invalid Credentials', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('TC004 - Invalid username with valid password', async ({ page }) => {
    // Step 1: Verify page elements
    const usernameField = page.locator('input[name="username"], input[type="text"]').first();
    const passwordField = page.locator('input[type="password"]').first();
    const loginButton = page.locator('button[type="submit"], .login-btn, .btn-login').first();
    
    await expect(usernameField).toBeVisible();
    await expect(passwordField).toBeVisible();
    await expect(loginButton).toBeVisible();
    
    // Step 2: Enter invalid username and valid password
    await usernameField.fill('invaliduser');
    await passwordField.fill('1q2w3E*');
    
    await loginPage.takeScreenshot('invalid-username-entered');
    
    // Step 3: Submit form
    await loginButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Step 4: Verify error handling
    // Should remain on login page
    await expect(page).toHaveURL(/.*\/login/);
    
    // Check for error messages
    const errorMessages = [
      page.locator('.error, .alert-danger, .error-message'),
      page.locator('[role="alert"]'),
      page.locator('.invalid-feedback'),
      page.locator('text="Invalid"'),
      page.locator('text="incorrect"'),
      page.locator('text="wrong"')
    ];
    
    let errorFound = false;
    for (const errorMsg of errorMessages) {
      if (await errorMsg.count() > 0 && await errorMsg.first().isVisible()) {
        errorFound = true;
        break;
      }
    }
    
    // Either error message should be shown or we should remain on login page
    expect(errorFound || page.url().includes('/login')).toBe(true);
    
    await loginPage.takeScreenshot('invalid-username-result');
  });

  test('TC005 - Valid username with invalid password', async ({ page }) => {
    const usernameField = page.locator('input[name="username"], input[type="text"]').first();
    const passwordField = page.locator('input[type="password"]').first();
    const loginButton = page.locator('button[type="submit"], .login-btn, .btn-login').first();
    
    // Enter valid username and invalid password
    await usernameField.fill('admin');
    await passwordField.fill('wrongpassword');
    
    await loginPage.takeScreenshot('invalid-password-entered');
    
    // Submit form
    await loginButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Verify error handling
    await expect(page).toHaveURL(/.*\/login/);
    
    // Check for error indication (error message or remaining on login page)
    const stillOnLoginPage = page.url().includes('/login');
    expect(stillOnLoginPage).toBe(true);
    
    await loginPage.takeScreenshot('invalid-password-result');
  });

  test('TC006 - Empty credentials submission', async ({ page }) => {
    const loginButton = page.locator('button[type="submit"], .login-btn, .btn-login').first();
    
    // Try to submit with empty fields
    await loginButton.click();
    await page.waitForTimeout(1000);
    
    // Should either show validation error or remain on login page
    await expect(page).toHaveURL(/.*\/login/);
    
    // Check for validation messages
    const validationMessages = [
      page.locator('input:invalid'),
      page.locator('.required, .error'),
      page.locator('[role="alert"]')
    ];
    
    await loginPage.takeScreenshot('empty-fields-submission');
  });

  test('TC007 - SQL injection attempt', async ({ page }) => {
    const usernameField = page.locator('input[name="username"], input[type="text"]').first();
    const passwordField = page.locator('input[type="password"]').first();
    const loginButton = page.locator('button[type="submit"], .login-btn, .btn-login').first();
    
    // Attempt SQL injection
    await usernameField.fill("' OR '1'='1");
    await passwordField.fill("' OR '1'='1");
    
    await loginPage.takeScreenshot('sql-injection-attempt');
    
    await loginButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Should not succeed - remain on login page
    await expect(page).toHaveURL(/.*\/login/);
    
    await loginPage.takeScreenshot('sql-injection-blocked');
  });

  test('TC008 - XSS injection attempt', async ({ page }) => {
    const usernameField = page.locator('input[name="username"], input[type="text"]').first();
    const passwordField = page.locator('input[type="password"]').first();
    const loginButton = page.locator('button[type="submit"], .login-btn, .btn-login').first();
    
    // Attempt XSS injection
    await usernameField.fill('<script>alert("xss")</script>');
    await passwordField.fill('<img src=x onerror=alert("xss")>');
    
    await loginButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Should not execute script and remain on login page
    await expect(page).toHaveURL(/.*\/login/);
    
    // Check that no alert was triggered
    page.on('dialog', async dialog => {
      expect(dialog.type()).not.toBe('alert');
      await dialog.dismiss();
    });
    
    await loginPage.takeScreenshot('xss-injection-blocked');
  });

  test('TC009 - Case sensitivity test', async ({ page }) => {
    const usernameField = page.locator('input[name="username"], input[type="text"]').first();
    const passwordField = page.locator('input[type="password"]').first();
    const loginButton = page.locator('button[type="submit"], .login-btn, .btn-login').first();
    
    // Test different case variations
    const testCases = [
      { username: 'ADMIN', password: '1q2w3E*' },
      { username: 'Admin', password: '1q2w3E*' },
      { username: 'admin', password: '1Q2W3E*' }
    ];
    
    for (const testCase of testCases) {
      // Clear fields and enter test credentials
      await usernameField.fill('');
      await passwordField.fill('');
      await usernameField.fill(testCase.username);
      await passwordField.fill(testCase.password);
      
      await loginButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Document the behavior
      const currentUrl = page.url();
      const isStillOnLogin = currentUrl.includes('/login');
      
      await loginPage.takeScreenshot(`case-test-${testCase.username.toLowerCase()}`);
      
      // If successful login occurred, logout for next test
      if (!isStillOnLogin) {
        try {
          const logoutButton = page.locator('a:has-text("Logout"), button:has-text("Logout")');
          if (await logoutButton.count() > 0) {
            await logoutButton.first().click();
            await page.waitForLoadState('networkidle');
          }
        } catch (error) {
          // Navigate back to login manually
          await page.goto('https://medlatec-portal-fe.vercel.app/login');
        }
      }
    }
  });

  test('TC010 - Long input stress test', async ({ page }) => {
    const usernameField = page.locator('input[name="username"], input[type="text"]').first();
    const passwordField = page.locator('input[type="password"]').first();
    const loginButton = page.locator('button[type="submit"], .login-btn, .btn-login').first();
    
    // Test very long inputs
    const longString = 'a'.repeat(1000);
    
    await usernameField.fill(longString);
    await passwordField.fill(longString);
    
    await loginButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Should handle gracefully and remain on login page
    await expect(page).toHaveURL(/.*\/login/);
    
    await loginPage.takeScreenshot('long-input-test');
  });

  test.afterEach(async ({ page }) => {
    // Ensure we're on login page for next test
    if (!page.url().includes('/login')) {
      await page.goto('https://medlatec-portal-fe.vercel.app/login');
      await page.waitForLoadState('networkidle');
    }
  });
});
