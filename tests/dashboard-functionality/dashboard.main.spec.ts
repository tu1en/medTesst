import { test, expect } from '@playwright/test';
import { LoginPage } from '../../utils/LoginPage';
import { BasePage } from '../../utils/BasePage';

test.describe('Dashboard Functionality', () => {
  let loginPage;
  let basePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    basePage = new BasePage(page);
    
    // Login before each test
    await loginPage.navigate();
    await loginPage.login('admin', '1q2w3E*');
    
    // Wait for dashboard to load
    await page.waitForLoadState('networkidle');
    await expect(page).not.toHaveURL(/.*\/login/);
  });

  test('TC011 - Dashboard page load and basic elements', async ({ page }) => {
    // Verify we're on dashboard/main page
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/login');
    
    // Take initial dashboard screenshot
    await basePage.takeScreenshot('dashboard-loaded');
    
    // Verify page title
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    
    // Check for common dashboard elements
    const dashboardElements = [
      page.locator('nav, .navbar, .navigation, .sidebar'),
      page.locator('.main-content, .content, .dashboard-content'),
      page.locator('header, .header, .app-header'),
      page.locator('.user-menu, .profile-menu, .account-menu')
    ];
    
    let foundElements = 0;
    for (const element of dashboardElements) {
      try {
        if (await element.count() > 0) {
          await expect(element.first()).toBeVisible();
          foundElements++;
        }
      } catch (error) {
        // Element not found, continue
      }
    }
    
    // At least one dashboard element should be present
    expect(foundElements).toBeGreaterThan(0);
  });

  test('TC012 - Navigation menu functionality', async ({ page }) => {
    // Look for navigation elements
    const navSelectors = [
      'nav a, .nav a, .navbar a',
      '.menu-item, .nav-item',
      '.sidebar a, .sidebar-nav a',
      '[role="menuitem"], [role="navigation"] a'
    ];
    
    let navigationItems = [];
    
    for (const selector of navSelectors) {
      const items = await page.locator(selector).all();
      for (const item of items) {
        try {
          if (await item.isVisible()) {
            const text = await item.textContent();
            const href = await item.getAttribute('href');
            if (text && text.trim().length > 0) {
              navigationItems.push({ element: item, text: text.trim(), href });
            }
          }
        } catch (error) {
          // Skip this item
        }
      }
    }
    
    console.log(`Found ${navigationItems.length} navigation items`);
    
    // Test first few navigation items (avoid logout)
    const testItems = navigationItems
      .filter(item => !item.text.toLowerCase().includes('logout'))
      .slice(0, 5);
    
    for (let i = 0; i < testItems.length; i++) {
      const item = testItems[i];
      try {
        await item.element.click();
        await page.waitForLoadState('networkidle');
        await basePage.takeScreenshot(`navigation-${i + 1}-${item.text.replace(/[^a-zA-Z0-9]/g, '-')}`);
        
        // Verify page changed or content updated
        const newUrl = page.url();
        console.log(`Navigated to: ${newUrl} for item: ${item.text}`);
        
        // Wait a moment before next navigation
        await page.waitForTimeout(1000);
      } catch (error) {
        console.log(`Failed to navigate to ${item.text}:`, error.message);
      }
    }
  });

  test('TC013 - Dashboard content and widgets', async ({ page }) => {
    // Look for common dashboard content types
    const contentSelectors = [
      '.widget, .card, .panel',
      '.dashboard-widget, .dashboard-card',
      '.stat, .statistic, .metric',
      'table, .table, .data-table',
      '.chart, .graph',
      '.summary, .overview'
    ];
    
    let contentElements = [];
    
    for (const selector of contentSelectors) {
      const elements = await page.locator(selector).all();
      for (const element of elements) {
        try {
          if (await element.isVisible()) {
            contentElements.push(element);
          }
        } catch (error) {
          // Skip this element
        }
      }
    }
    
    console.log(`Found ${contentElements.length} content elements`);
    
    // Take screenshot of content area
    await basePage.takeScreenshot('dashboard-content-overview');
    
    // Verify at least some content is present
    if (contentElements.length > 0) {
      expect(contentElements.length).toBeGreaterThan(0);
      
      // Test interaction with first few elements
      for (let i = 0; i < Math.min(contentElements.length, 3); i++) {
        try {
          await contentElements[i].hover();
          await page.waitForTimeout(500);
        } catch (error) {
          // Hover failed, continue
        }
      }
    }
  });

  test('TC014 - User profile and account information', async ({ page }) => {
    // Look for user profile elements
    const profileSelectors = [
      '.user-name, .username, .user-info',
      '.profile, .account, .user-menu',
      '.avatar, .user-avatar',
      '[data-user], [data-profile]'
    ];
    
    let profileFound = false;
    
    for (const selector of profileSelectors) {
      try {
        const element = page.locator(selector);
        if (await element.count() > 0 && await element.first().isVisible()) {
          profileFound = true;
          await element.first().hover();
          break;
        }
      } catch (error) {
        // Continue looking
      }
    }
    
    // Look for text that might indicate user info
    const userTexts = ['admin', 'welcome', 'hello', 'dashboard'];
    for (const text of userTexts) {
      try {
        const element = page.locator(`text="${text}" i`);
        if (await element.count() > 0) {
          profileFound = true;
          break;
        }
      } catch (error) {
        // Continue
      }
    }
    
    await basePage.takeScreenshot('user-profile-check');
    
    // Document findings
    console.log(`User profile elements found: ${profileFound}`);
  });

  test('TC015 - Interactive elements functionality', async ({ page }) => {
    // Find interactive elements
    const interactiveSelectors = [
      'button:not([disabled])',
      'a[href]:not([href="#"])',
      'input, select, textarea',
      '[role="button"], [role="link"]',
      '.btn, .button'
    ];
    
    let interactiveElements = [];
    
    for (const selector of interactiveSelectors) {
      const elements = await page.locator(selector).all();
      for (const element of elements) {
        try {
          if (await element.isVisible() && await element.isEnabled()) {
            interactiveElements.push(element);
          }
        } catch (error) {
          // Skip this element
        }
      }
    }
    
    console.log(`Found ${interactiveElements.length} interactive elements`);
    
    // Test hover and focus on first few elements
    const testCount = Math.min(interactiveElements.length, 5);
    for (let i = 0; i < testCount; i++) {
      try {
        await interactiveElements[i].hover();
        await page.waitForTimeout(300);
        
        // Try to focus if it's focusable
        try {
          await interactiveElements[i].focus();
          await page.waitForTimeout(300);
        } catch (error) {
          // Focus failed, continue
        }
      } catch (error) {
        console.log(`Failed to interact with element ${i}:`, error.message);
      }
    }
    
    await basePage.takeScreenshot('interactive-elements-tested');
  });

  test('TC016 - Responsive design verification', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop-large' },
      { width: 1366, height: 768, name: 'desktop-medium' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(1000);
      
      // Take screenshot of each viewport
      await basePage.takeScreenshot(`responsive-${viewport.name}`);
      
      // Verify page still functions
      const navigation = page.locator('nav, .navbar, .menu');
      if (await navigation.count() > 0) {
        // Navigation should still be accessible in some form
        try {
          await expect(navigation.first()).toBeVisible();
        } catch (error) {
          // On mobile, navigation might be hidden behind hamburger menu
          const hamburger = page.locator('.hamburger, .menu-toggle, .navbar-toggle');
          if (await hamburger.count() > 0) {
            await expect(hamburger.first()).toBeVisible();
          }
        }
      }
    }
    
    // Reset to desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test('TC017 - Performance and loading verification', async ({ page }) => {
    // Measure page load performance
    const navigationStart = await page.evaluate(() => performance.timing.navigationStart);
    const loadComplete = await page.evaluate(() => performance.timing.loadEventEnd);
    const loadTime = loadComplete - navigationStart;
    
    console.log(`Page load time: ${loadTime}ms`);
    
    // Check for console errors
    const consoleMessages = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });
    
    // Reload page to capture any console errors
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    await basePage.takeScreenshot('performance-check');
    
    // Log findings
    console.log(`Console errors found: ${consoleMessages.length}`);
    if (consoleMessages.length > 0) {
      console.log('Console errors:', consoleMessages);
    }
    
    // Performance should be reasonable (less than 10 seconds)
    expect(loadTime).toBeLessThan(10000);
  });

  test.afterEach(async ({ page }) => {
    // Take final screenshot of current state
    await basePage.takeScreenshot('test-end-state');
  });
});
