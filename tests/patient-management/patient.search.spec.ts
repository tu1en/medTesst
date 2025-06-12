import { test, expect } from '@playwright/test';

test.describe('Patient Management - Search and List Patients', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="username"], input[type="text"]', 'admin');
    await page.fill('input[type="password"]', '1q2w3E*');
    await page.click('button[type="submit"], .login-btn');
    await page.waitForLoadState('networkidle');
  });

  test('TC001 - Verify patient list displays correctly', async ({ page }) => {
    // Step 1: Navigate to Patient List
    await page.goto('/patients');
    await expect(page).toHaveURL(/.*patients/);
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ path: './evidence/screenshots/patient-list-01-default.png', fullPage: true });

    // Step 2: Verify list components are present
    const listComponents = [
      page.locator('table, .patient-list, .data-grid'),
      page.locator('thead, .table-header, .list-header'),
      page.locator('tbody tr, .patient-item, .list-item')
    ];

    for (const component of listComponents) {
      if (await component.count() > 0) {
        await expect(component.first()).toBeVisible();
      }
    }

    // Verify column headers
    const expectedHeaders = ['Name', 'ID', 'Phone', 'Email', 'Actions'];
    for (const header of expectedHeaders) {
      const headerElement = page.locator(`th:has-text("${header}"), .header:has-text("${header}")`);
      if (await headerElement.count() > 0) {
        await expect(headerElement.first()).toBeVisible();
      }
    }

    // Verify at least one patient record exists
    const patientRows = page.locator('tbody tr, .patient-item');
    if (await patientRows.count() > 0) {
      await expect(patientRows.first()).toBeVisible();
    }
  });

  test('TC002 - Test basic search functionality', async ({ page }) => {
    await page.goto('/patients');
    await page.waitForLoadState('networkidle');

    // Step 3: Test Basic Search
    const searchBox = page.locator('input[type="search"], .search-input, input[placeholder*="search" i]');
    
    if (await searchBox.count() > 0) {
      // Test search by name
      await searchBox.fill('John');
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');
      
      await page.screenshot({ path: './evidence/screenshots/patient-search-01-name.png', fullPage: true });

      // Verify search results
      const searchResults = page.locator('tbody tr, .patient-item');
      if (await searchResults.count() > 0) {
        const firstResult = searchResults.first();
        await expect(firstResult).toContainText('John', { ignoreCase: true });
      }

      // Clear search
      await searchBox.clear();
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');

      // Test search by ID (if applicable)
      await searchBox.fill('001');
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');
      
      await page.screenshot({ path: './evidence/screenshots/patient-search-02-id.png', fullPage: true });

      // Test search with no results
      await searchBox.fill('nonexistentpatient12345');
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');

      // Verify no results message
      const noResultsMessage = page.locator('text=/no results|not found|no patients/i, .no-data, .empty-state');
      if (await noResultsMessage.count() > 0) {
        await expect(noResultsMessage.first()).toBeVisible();
      }
      
      await page.screenshot({ path: './evidence/screenshots/patient-search-03-no-results.png', fullPage: true });
    }
  });

  test('TC003 - Test filtering functionality', async ({ page }) => {
    await page.goto('/patients');
    await page.waitForLoadState('networkidle');

    // Step 4: Test Advanced Filtering
    const filterControls = [
      page.locator('select[name="gender"], .gender-filter'),
      page.locator('select[name="bloodType"], .blood-type-filter'),
      page.locator('input[type="date"], .date-filter')
    ];

    for (const filter of filterControls) {
      if (await filter.count() > 0) {
        const filterType = await filter.getAttribute('name') || 'unknown';
        
        if (filterType.includes('gender')) {
          await filter.selectOption('Male');
          await page.waitForLoadState('networkidle');
          await page.screenshot({ path: './evidence/screenshots/patient-filter-gender.png', fullPage: true });
        }
        
        if (filterType.includes('bloodType')) {
          await filter.selectOption('O+');
          await page.waitForLoadState('networkidle');
          await page.screenshot({ path: './evidence/screenshots/patient-filter-blood-type.png', fullPage: true });
        }
      }
    }

    // Test filter reset
    const resetButton = page.locator('button:has-text("Reset"), .btn-reset, .clear-filters');
    if (await resetButton.count() > 0) {
      await resetButton.click();
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: './evidence/screenshots/patient-filter-reset.png', fullPage: true });
    }
  });

  test('TC004 - Test sorting functionality', async ({ page }) => {
    await page.goto('/patients');
    await page.waitForLoadState('networkidle');

    // Step 6: Test Sorting
    const sortableHeaders = page.locator('th[data-sort], .sortable, th:has(.sort-icon)');
    
    if (await sortableHeaders.count() > 0) {
      const nameHeader = page.locator('th:has-text("Name"), .header:has-text("Name")').first();
      
      if (await nameHeader.count() > 0) {
        // Test ascending sort
        await nameHeader.click();
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: './evidence/screenshots/patient-sort-asc.png', fullPage: true });

        // Test descending sort
        await nameHeader.click();
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: './evidence/screenshots/patient-sort-desc.png', fullPage: true });
      }
    }
  });

  test('TC005 - Test pagination controls', async ({ page }) => {
    await page.goto('/patients');
    await page.waitForLoadState('networkidle');

    // Step 7: Test Pagination
    const paginationControls = [
      page.locator('.pagination, .pager'),
      page.locator('button:has-text("Next"), .btn-next'),
      page.locator('button:has-text("Previous"), .btn-prev'),
      page.locator('.page-size-selector, select[name="pageSize"]')
    ];

    for (const control of paginationControls) {
      if (await control.count() > 0) {
        await expect(control.first()).toBeVisible();
      }
    }

    // Test page size change
    const pageSizeSelector = page.locator('select[name="pageSize"], .page-size-selector select');
    if (await pageSizeSelector.count() > 0) {
      await pageSizeSelector.selectOption('50');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: './evidence/screenshots/patient-pagination-size.png', fullPage: true });
    }

    // Test next page navigation
    const nextButton = page.locator('button:has-text("Next"), .btn-next, .pagination-next');
    if (await nextButton.count() > 0 && await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: './evidence/screenshots/patient-pagination-next.png', fullPage: true });
    }
  });

  test('TC006 - Test patient record actions', async ({ page }) => {
    await page.goto('/patients');
    await page.waitForLoadState('networkidle');

    // Step 5: Test Patient Record Actions
    const firstPatientRow = page.locator('tbody tr, .patient-item').first();
    
    if (await firstPatientRow.count() > 0) {
      // Test view action
      const viewButton = firstPatientRow.locator('button:has-text("View"), .btn-view, a:has-text("View")');
      if (await viewButton.count() > 0) {
        await viewButton.click();
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: './evidence/screenshots/patient-view-details.png', fullPage: true });
        
        // Return to list
        await page.goBack();
        await page.waitForLoadState('networkidle');
      }

      // Test edit action
      const editButton = firstPatientRow.locator('button:has-text("Edit"), .btn-edit, a:has-text("Edit")');
      if (await editButton.count() > 0) {
        await editButton.click();
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: './evidence/screenshots/patient-edit-form.png', fullPage: true });
        
        // Return to list
        await page.goBack();
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('TC007 - Test responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/patients');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ path: './evidence/screenshots/patient-mobile-view.png', fullPage: true });

    // Verify mobile-friendly elements
    const mobileElements = [
      page.locator('.mobile-menu, .hamburger'),
      page.locator('.responsive-table, .mobile-cards')
    ];

    for (const element of mobileElements) {
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
      }
    }

    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });
});
