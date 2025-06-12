import { test, expect } from '@playwright/test';
import { LoginPage } from '../../utils/LoginPage';

test.describe('Login Functionality - Successful Login', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  test('TC001 - Successful login with valid credentials', async ({ page }) => {
    // Step 1: Navigate to login page
    await loginPage.navigate();
    
    // Verify page loaded successfully
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page).toHaveTitle(/.*[Ll]ogin|.*[Mm]edlatec/);
    
    // Take initial screenshot
    await loginPage.takeScreenshot('01-login-page-loaded');
    
    // Step 2: Verify page elements are present
    const usernameField = page.locator('input[name="username"], input[type="text"], input[placeholder*="user" i]').first();
    const passwordField = page.locator('input[name="password"], input[type="password"]').first();
    const loginButton = page.locator('button[type="submit"], .login-btn, .btn-login, button:has-text("Login"), button:has-text("Sign")').first();
    
    await expect(usernameField).toBeVisible();
    await expect(passwordField).toBeVisible();
    await expect(loginButton).toBeVisible();
    
    // Step 3: Enter valid username
    await usernameField.fill('admin');
    await expect(usernameField).toHaveValue('admin');
    
    // Step 4: Enter valid password
    await passwordField.fill('1q2w3E*');
    await expect(passwordField).toHaveValue('1q2w3E*');
    
    // Take screenshot before login submission
    await loginPage.takeScreenshot('02-credentials-entered');
    
    // Step 5: Submit login form
    await loginButton.click();
    
    // Step 6: Wait for navigation and verify successful login
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Verify we're no longer on login page
    await expect(page).not.toHaveURL(/.*\/login/);
    
    // Check for common dashboard indicators
    const dashboardIndicators = [
      page.locator('nav, .navbar, .navigation'),
      page.locator('.dashboard, .main-content, .content'),
      page.locator('a:has-text("Dashboard"), a:has-text("Home")'),
      page.locator('.user-menu, .profile, .logout')
    ];
    
    let dashboardFound = false;
    for (const indicator of dashboardIndicators) {
      try {
        await expect(indicator.first()).toBeVisible({ timeout: 5000 });
        dashboardFound = true;
        break;
      } catch (error) {
        // Continue checking other indicators
      }
    }
    
    expect(dashboardFound).toBe(true);
    
    // Step 7: Verify dashboard content is accessible
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/login');
    
    // Take final screenshot
    await loginPage.takeScreenshot('03-successful-login-dashboard');
    
    // Step 8: Verify no error messages are displayed
    const errorSelectors = [
      '.error, .alert-danger, .error-message',
      '[role="alert"]',
      '.invalid-feedback'
    ];
    
    for (const errorSelector of errorSelectors) {
      const errorElement = page.locator(errorSelector);
      if (await errorElement.count() > 0) {
        await expect(errorElement).not.toBeVisible();
      }
    }
  });

  test('TC002 - Verify login form elements and accessibility', async ({ page }) => {
    await loginPage.navigate();
    
    // Test form accessibility and structure
    const usernameField = page.locator('input[name="username"], input[type="text"]').first();
    const passwordField = page.locator('input[type="password"]').first();
    const loginButton = page.locator('button[type="submit"], .login-btn').first();
    
    // Verify field attributes
    await expect(usernameField).toBeEditable();
    await expect(passwordField).toBeEditable();
    await expect(loginButton).toBeEnabled();
    
    // Test tab navigation
    await usernameField.focus();
    await page.keyboard.press('Tab');
    await expect(passwordField).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(loginButton).toBeFocused();
    
    // Test form labels (if present)
    const usernameLabel = page.locator('label[for*="user"], label:has-text("Username"), label:has-text("User")');
    const passwordLabel = page.locator('label[for*="pass"], label:has-text("Password")');
    
    if (await usernameLabel.count() > 0) {
      await expect(usernameLabel.first()).toBeVisible();
    }
    
    if (await passwordLabel.count() > 0) {
      await expect(passwordLabel.first()).toBeVisible();
    }
    
    await loginPage.takeScreenshot('accessibility-verification');
  });

  test('TC003 - Login form keyboard interaction', async ({ page }) => {
    await loginPage.navigate();
    
    const usernameField = page.locator('input[name="username"], input[type="text"]').first();
    const passwordField = page.locator('input[type="password"]').first();
    
    // Enter credentials using keyboard
    await usernameField.focus();
    await page.keyboard.type('admin');
    
    await page.keyboard.press('Tab');
    await page.keyboard.type('1q2w3E*');
    
    // Submit using Enter key
    await page.keyboard.press('Enter');
    
    // Verify navigation
    await page.waitForLoadState('networkidle');
    await expect(page).not.toHaveURL(/.*\/login/);
    
    await loginPage.takeScreenshot('keyboard-login-success');
  });

  test.afterEach(async ({ page }) => {
    // Cleanup: try to logout if we're logged in
    const currentUrl = page.url();
    if (!currentUrl.includes('/login')) {
      try {
        const logoutButton = page.locator('a:has-text("Logout"), button:has-text("Logout"), .logout');
        if (await logoutButton.count() > 0) {
          await logoutButton.first().click();
          await page.waitForLoadState('networkidle');
        }
      } catch (error) {
        // Logout failed, continue with cleanup
      }
    }
  });
});
