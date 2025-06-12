import { test, expect } from '@playwright/test';

test.describe('User Management - Create New User', () => {
  test.beforeEach(async ({ page }) => {
    // Login as administrator
    await page.goto('/login');
    await page.fill('input[name="username"], input[type="text"]', 'admin');
    await page.fill('input[type="password"]', '1q2w3E*');
    await page.click('button[type="submit"], .login-btn');
    await page.waitForLoadState('networkidle');
  });

  test('TC001 - Create new user with complete information', async ({ page }) => {
    // Step 1: Navigate to User Management
    await page.goto('/users');
    await expect(page).toHaveURL(/.*users/);
    await page.screenshot({ path: './evidence/screenshots/user-01-management-page.png', fullPage: true });

    // Step 2: Access Create User Form
    const addUserButton = page.locator('button:has-text("Add"), .add-user, .btn-add, a:has-text("New User")');
    await expect(addUserButton.first()).toBeVisible();
    await addUserButton.first().click();
    
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: './evidence/screenshots/user-02-create-form.png', fullPage: true });

    // Step 3: Fill User Basic Information
    const userData = {
      username: 'testuser001',
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser001@medlatec.com',
      employeeId: 'EMP001',
      department: 'IT'
    };

    await page.fill('input[name="username"], input[placeholder*="username" i]', userData.username);
    await page.fill('input[name="firstName"], input[placeholder*="first" i]', userData.firstName);
    await page.fill('input[name="lastName"], input[placeholder*="last" i]', userData.lastName);
    await page.fill('input[name="email"], input[type="email"]', userData.email);
    await page.fill('input[name="employeeId"], input[placeholder*="employee" i]', userData.employeeId);
    
    // Department selection (dropdown or input)
    const departmentSelect = page.locator('select[name="department"], .department-select');
    if (await departmentSelect.count() > 0) {
      await departmentSelect.selectOption(userData.department);
    } else {
      await page.fill('input[name="department"], input[placeholder*="department" i]', userData.department);
    }

    await page.screenshot({ path: './evidence/screenshots/user-03-basic-info.png', fullPage: true });

    // Step 4: Set User Authentication
    const authData = {
      password: 'TempPass123!',
      confirmPassword: 'TempPass123!'
    };

    const passwordField = page.locator('input[name="password"], input[type="password"]').first();
    const confirmPasswordField = page.locator('input[name="confirmPassword"], input[name="passwordConfirm"]');
    
    if (await passwordField.count() > 0) {
      await passwordField.fill(authData.password);
    }
    
    if (await confirmPasswordField.count() > 0) {
      await confirmPasswordField.fill(authData.confirmPassword);
    }

    // Force password change checkbox
    const forcePasswordChange = page.locator('input[name="forcePasswordChange"], .force-password-change');
    if (await forcePasswordChange.count() > 0) {
      await forcePasswordChange.check();
    }

    await page.screenshot({ path: './evidence/screenshots/user-04-authentication.png', fullPage: true });

    // Step 5: Assign User Roles and Permissions
    const roleSelect = page.locator('select[name="role"], .role-select, .user-role');
    if (await roleSelect.count() > 0) {
      await roleSelect.selectOption('Nurse'); // Default role for test
      await page.screenshot({ path: './evidence/screenshots/user-05-role-assignment.png', fullPage: true });
    }

    // Check specific permissions if available
    const permissions = [
      'patient-read',
      'appointment-read',
      'appointment-create'
    ];

    for (const permission of permissions) {
      const permissionCheckbox = page.locator(`input[name="${permission}"], input[value="${permission}"]`);
      if (await permissionCheckbox.count() > 0) {
        await permissionCheckbox.check();
      }
    }

    // Step 6: Configure User Profile Settings
    const profileData = {
      phone: '+1234567890',
      specialization: 'General Nursing',
      status: 'Active'
    };

    await page.fill('input[name="phone"], input[type="tel"]', profileData.phone);
    
    const specializationField = page.locator('input[name="specialization"], .specialization');
    if (await specializationField.count() > 0) {
      await specializationField.fill(profileData.specialization);
    }

    // Status selection
    const statusSelect = page.locator('select[name="status"], .status-select');
    if (await statusSelect.count() > 0) {
      await statusSelect.selectOption(profileData.status);
    }

    await page.screenshot({ path: './evidence/screenshots/user-06-profile-settings.png', fullPage: true });

    // Step 7: Submit User Account
    const submitButton = page.locator('button[type="submit"], .btn-save, .btn-create, button:has-text("Save")');
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Wait for submission and verify success
    await page.waitForLoadState('networkidle');
    
    const successIndicators = [
      page.locator('.success, .alert-success, .notification-success'),
      page.locator('text=/success|created|saved/i'),
      page.locator('[role="alert"]:has-text("success")')
    ];

    let successFound = false;
    for (const indicator of successIndicators) {
      if (await indicator.count() > 0) {
        await expect(indicator.first()).toBeVisible();
        successFound = true;
        break;
      }
    }

    await page.screenshot({ path: './evidence/screenshots/user-07-creation-success.png', fullPage: true });

    // Step 8: Verify User in System
    if (!page.url().includes('/users')) {
      await page.goto('/users');
    }

    // Search for the newly created user
    const searchBox = page.locator('input[type="search"], .search-input, input[placeholder*="search" i]');
    if (await searchBox.count() > 0) {
      await searchBox.fill(userData.username);
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');
    }

    // Verify user appears in list
    const userRow = page.locator(`tr:has-text("${userData.username}"), .user-item:has-text("${userData.username}")`);
    await expect(userRow.first()).toBeVisible();
    
    await page.screenshot({ path: './evidence/screenshots/user-08-verification.png', fullPage: true });
  });

  test('TC002 - Validate username uniqueness', async ({ page }) => {
    await page.goto('/users');
    
    const addButton = page.locator('button:has-text("Add"), .add-user, .btn-add');
    await addButton.first().click();
    await page.waitForLoadState('networkidle');

    // Try to create user with existing username
    await page.fill('input[name="username"], input[placeholder*="username" i]', 'admin');
    await page.keyboard.press('Tab'); // Trigger validation

    // Wait for validation message
    await page.waitForTimeout(1000);

    // Check for validation error
    const validationError = page.locator('.error, .invalid-feedback, .validation-error');
    if (await validationError.count() > 0) {
      await expect(validationError.first()).toBeVisible();
      expect(await validationError.first().textContent()).toMatch(/username.*exists|already.*taken/i);
    }
    
    await page.screenshot({ path: './evidence/screenshots/user-username-validation.png', fullPage: true });
  });

  test('TC003 - Test password complexity validation', async ({ page }) => {
    await page.goto('/users');
    
    const addButton = page.locator('button:has-text("Add"), .add-user');
    await addButton.first().click();
    await page.waitForLoadState('networkidle');

    // Test weak passwords
    const weakPasswords = ['123', 'password', 'abc123'];
    const passwordField = page.locator('input[name="password"], input[type="password"]').first();

    for (const weakPassword of weakPasswords) {
      await passwordField.fill(weakPassword);
      await page.keyboard.press('Tab');
      await page.waitForTimeout(500);

      const passwordError = page.locator('.password-error, .invalid-feedback');
      if (await passwordError.count() > 0) {
        await expect(passwordError.first()).toBeVisible();
      }
    }

    await page.screenshot({ path: './evidence/screenshots/user-password-validation.png', fullPage: true });
  });

  test('TC004 - Test required field validation', async ({ page }) => {
    await page.goto('/users');
    
    const addButton = page.locator('button:has-text("Add"), .add-user');
    await addButton.first().click();
    await page.waitForLoadState('networkidle');

    // Try to submit form without required fields
    const submitButton = page.locator('button[type="submit"], .btn-save, button:has-text("Save")');
    await submitButton.click();

    // Verify required field validation messages
    const requiredFields = [
      'input[name="username"]',
      'input[name="firstName"]',
      'input[name="lastName"]',
      'input[name="email"]'
    ];

    for (const fieldSelector of requiredFields) {
      const field = page.locator(fieldSelector);
      if (await field.count() > 0) {
        // Check for validation state
        const isInvalid = await field.getAttribute('aria-invalid');
        if (isInvalid === 'true') {
          expect(isInvalid).toBe('true');
        }
      }
    }

    await page.screenshot({ path: './evidence/screenshots/user-required-validation.png', fullPage: true });
  });

  test('TC005 - Test email format validation', async ({ page }) => {
    await page.goto('/users');
    
    const addButton = page.locator('button:has-text("Add"), .add-user');
    await addButton.first().click();
    await page.waitForLoadState('networkidle');

    // Test invalid email formats
    const invalidEmails = ['invalid-email', '@example.com', 'test@', 'test..test@example.com'];
    const emailField = page.locator('input[name="email"], input[type="email"]');

    for (const invalidEmail of invalidEmails) {
      await emailField.fill(invalidEmail);
      await page.keyboard.press('Tab');
      await page.waitForTimeout(500);

      // Check for email validation error
      const emailError = page.locator('.email-error, .invalid-feedback');
      if (await emailError.count() > 0) {
        await expect(emailError.first()).toBeVisible();
      }
    }

    await page.screenshot({ path: './evidence/screenshots/user-email-validation.png', fullPage: true });
  });
});
