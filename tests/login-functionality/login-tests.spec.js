import { test, expect } from '@playwright/test';
import { LoginElements, LoginTestData, LoginExpectedBehaviors } from './login-elements.js';

test.describe('Login Functionality Tests', () => {
  let page;
  
  test.beforeEach(async ({ browser }) => {
    const context = await browser.newContext({
      recordVideo: {
        dir: './evidence/videos/login/',
        size: { width: 1920, height: 1080 }
      }
    });
    page = await context.newPage();
    
    // Navigate to login page
    await page.goto('https://medlatec-portal-fe.vercel.app/login');
    await page.waitForLoadState('networkidle');
    
    // Take initial screenshot
    await page.screenshot({ 
      path: './evidence/screenshots/login/01-login-page-loaded.png',
      fullPage: true 
    });
  });
  
  test.afterEach(async () => {
    await page.close();
  });
  
  // Helper function to find element using multiple selectors
  async function findElement(elementConfig) {
    for (const selector of elementConfig.selectors) {
      try {
        const element = await page.locator(selector).first();
        if (await element.isVisible()) {
          return element;
        }
      } catch (error) {
        continue;
      }
    }
    if (elementConfig.required) {
      throw new Error(`Required element not found: ${elementConfig.description}`);
    }
    return null;
  }
  
  test('TC001 - Verify login page elements are present', async () => {
    console.log('Testing login page elements...');
    
    // Check if username field exists
    const usernameField = await findElement(LoginElements.usernameField);
    expect(usernameField).not.toBeNull();
    await expect(usernameField).toBeVisible();
    
    // Check if password field exists
    const passwordField = await findElement(LoginElements.passwordField);
    expect(passwordField).not.toBeNull();
    await expect(passwordField).toBeVisible();
    
    // Check if login button exists
    const loginButton = await findElement(LoginElements.loginButton);
    expect(loginButton).not.toBeNull();
    await expect(loginButton).toBeVisible();
    
    // Check if form exists
    const loginForm = await findElement(LoginElements.loginForm);
    expect(loginForm).not.toBeNull();
    
    await page.screenshot({ 
      path: './evidence/screenshots/login/TC001-elements-verified.png',
      fullPage: true 
    });
  });
  
  test('TC002 - Valid login credentials', async () => {
    console.log('Testing valid login...');
    
    const { username, password } = LoginTestData.validCredentials;
    
    // Fill credentials
    const usernameField = await findElement(LoginElements.usernameField);
    const passwordField = await findElement(LoginElements.passwordField);
    const loginButton = await findElement(LoginElements.loginButton);
    
    await usernameField.fill(username);
    await passwordField.fill(password);
    
    await page.screenshot({ 
      path: './evidence/screenshots/login/TC002-credentials-filled.png' 
    });
    
    // Click login
    await loginButton.click();
    
    // Wait for response
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    await page.screenshot({ 
      path: './evidence/screenshots/login/TC002-after-login-attempt.png',
      fullPage: true 
    });
    
    // Check if login was successful
    const currentUrl = page.url();
    console.log('Current URL after login:', currentUrl);
    
    // Expect URL to change (successful login)
    expect(currentUrl).not.toContain('/login');
  });
  
  test('TC003 - Invalid login credentials', async () => {
    console.log('Testing invalid login credentials...');
    
    for (const invalidCred of LoginTestData.invalidCredentials) {
      console.log(`Testing: ${invalidCred.description}`);
      
      const usernameField = await findElement(LoginElements.usernameField);
      const passwordField = await findElement(LoginElements.passwordField);
      const loginButton = await findElement(LoginElements.loginButton);
      
      // Clear and fill credentials
      await usernameField.clear();
      await passwordField.clear();
      await usernameField.fill(invalidCred.username);
      await passwordField.fill(invalidCred.password);
      
      await page.screenshot({ 
        path: `./evidence/screenshots/login/TC003-${invalidCred.description.replace(/[^a-zA-Z0-9]/g, '-')}.png` 
      });
      
      // Attempt login
      await loginButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Should still be on login page
      expect(page.url()).toContain('/login');
      
      // Check for error message (if element exists)
      const errorElement = await findElement(LoginElements.errorMessage);
      if (errorElement) {
        await expect(errorElement).toBeVisible();
      }
      
      await page.screenshot({ 
        path: `./evidence/screenshots/login/TC003-${invalidCred.description.replace(/[^a-zA-Z0-9]/g, '-')}-result.png` 
      });
    }
  });
  
  test('TC004 - UI responsiveness test', async () => {
    console.log('Testing UI responsiveness...');
    
    // Test different viewport sizes
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(1000);
      
      await page.screenshot({ 
        path: `./evidence/screenshots/login/TC004-responsive-${viewport.name}.png`,
        fullPage: true 
      });
      
      // Check if elements are still visible
      const usernameField = await findElement(LoginElements.usernameField);
      const passwordField = await findElement(LoginElements.passwordField);
      const loginButton = await findElement(LoginElements.loginButton);
      
      await expect(usernameField).toBeVisible();
      await expect(passwordField).toBeVisible();
      await expect(loginButton).toBeVisible();
    }
  });
  
  test('TC005 - Form validation test', async () => {
    console.log('Testing form validation...');
    
    const loginButton = await findElement(LoginElements.loginButton);
    
    // Try to submit empty form
    await loginButton.click();
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: './evidence/screenshots/login/TC005-empty-form-submission.png' 
    });
    
    // Should still be on login page
    expect(page.url()).toContain('/login');
    
    // Fill only username
    const usernameField = await findElement(LoginElements.usernameField);
    await usernameField.fill('admin');
    await loginButton.click();
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: './evidence/screenshots/login/TC005-username-only.png' 
    });
    
    // Should still be on login page
    expect(page.url()).toContain('/login');
  });
});
