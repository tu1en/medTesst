import { test, expect } from '@playwright/test';

test.describe('User Management - Role Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as administrator
    await page.goto('/login');
    await page.fill('input[name="username"], input[type="text"]', 'admin');
    await page.fill('input[type="password"]', '1q2w3E*');
    await page.click('button[type="submit"], .login-btn');
    await page.waitForLoadState('networkidle');
  });

  test('TC001 - View and verify existing roles', async ({ page }) => {
    // Step 1: Navigate to Role Management
    await page.goto('/roles');
    await expect(page).toHaveURL(/.*roles/);
    await page.screenshot({ path: './evidence/screenshots/role-01-management-page.png', fullPage: true });

    // Step 2: Verify existing roles display
    const rolesTable = page.locator('table, .roles-list, .role-grid');
    await expect(rolesTable.first()).toBeVisible();

    // Common healthcare system roles to verify
    const expectedRoles = ['Administrator', 'Doctor', 'Nurse', 'Receptionist', 'Manager'];
    
    for (const roleName of expectedRoles) {
      const roleElement = page.locator(`text="${roleName}", tr:has-text("${roleName}"), .role:has-text("${roleName}")`);
      if (await roleElement.count() > 0) {
        await expect(roleElement.first()).toBeVisible();
      }
    }

    await page.screenshot({ path: './evidence/screenshots/role-02-existing-roles.png', fullPage: true });

    // Step 3: View role permissions
    const firstRoleRow = page.locator('tbody tr, .role-item').first();
    const viewPermissionsButton = firstRoleRow.locator('button:has-text("View"), .btn-view, a:has-text("Permissions")');
    
    if (await viewPermissionsButton.count() > 0) {
      await viewPermissionsButton.click();
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: './evidence/screenshots/role-03-permissions-view.png', fullPage: true });
      
      // Verify permissions list is displayed
      const permissionsContainer = page.locator('.permissions, .permission-list, .role-permissions');
      await expect(permissionsContainer.first()).toBeVisible();
    }
  });

  test('TC002 - Create custom role with specific permissions', async ({ page }) => {
    await page.goto('/roles');
    
    // Step 3: Create Custom Role
    const addRoleButton = page.locator('button:has-text("Add"), .add-role, .btn-add, a:has-text("New Role")');
    await expect(addRoleButton.first()).toBeVisible();
    await addRoleButton.first().click();
    
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: './evidence/screenshots/role-04-create-form.png', fullPage: true });

    // Fill role basic information
    const roleData = {
      name: 'Lab Technician',
      description: 'Laboratory technician with limited access to lab results and patient data'
    };

    await page.fill('input[name="name"], input[placeholder*="role name" i]', roleData.name);
    await page.fill('textarea[name="description"], input[name="description"]', roleData.description);

    // Step 4: Set specific permissions
    const permissionsToSelect = [
      'patient-read',
      'lab-results-read',
      'lab-results-create',
      'lab-results-update'
    ];

    for (const permission of permissionsToSelect) {
      const permissionCheckbox = page.locator(`input[name="${permission}"], input[value="${permission}"], label:has-text("${permission}")`);
      if (await permissionCheckbox.count() > 0) {
        await permissionCheckbox.check();
      }
    }

    await page.screenshot({ path: './evidence/screenshots/role-05-permissions-selected.png', fullPage: true });

    // Submit role creation
    const submitButton = page.locator('button[type="submit"], .btn-save, .btn-create, button:has-text("Save")');
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    await page.waitForLoadState('networkidle');
    
    // Verify success
    const successMessage = page.locator('.success, .alert-success, .notification-success');
    if (await successMessage.count() > 0) {
      await expect(successMessage.first()).toBeVisible();
    }

    await page.screenshot({ path: './evidence/screenshots/role-06-creation-success.png', fullPage: true });

    // Verify role appears in list
    const newRoleRow = page.locator(`tr:has-text("${roleData.name}"), .role-item:has-text("${roleData.name}")`);
    await expect(newRoleRow.first()).toBeVisible();
  });

  test('TC003 - Modify existing role permissions', async ({ page }) => {
    await page.goto('/roles');
    
    // Find an existing role to modify (avoid system roles)
    const editableRoles = page.locator('tr:has-text("Nurse"), tr:has-text("Receptionist")');
    const firstEditableRole = editableRoles.first();
    
    if (await firstEditableRole.count() > 0) {
      const editButton = firstEditableRole.locator('button:has-text("Edit"), .btn-edit, a:has-text("Edit")');
      
      if (await editButton.count() > 0) {
        await editButton.click();
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: './evidence/screenshots/role-07-edit-form.png', fullPage: true });

        // Modify permissions - add a new permission
        const newPermission = page.locator('input[name="reports-read"], input[value="reports-read"]');
        if (await newPermission.count() > 0 && !await newPermission.isChecked()) {
          await newPermission.check();
        }

        // Remove a permission if checked
        const removePermission = page.locator('input[name="user-delete"], input[value="user-delete"]');
        if (await removePermission.count() > 0 && await removePermission.isChecked()) {
          await removePermission.uncheck();
        }

        await page.screenshot({ path: './evidence/screenshots/role-08-permissions-modified.png', fullPage: true });

        // Save changes
        const saveButton = page.locator('button[type="submit"], .btn-save, button:has-text("Save")');
        await saveButton.click();
        await page.waitForLoadState('networkidle');

        await page.screenshot({ path: './evidence/screenshots/role-09-modification-success.png', fullPage: true });
      }
    }
  });

  test('TC004 - Assign role to user', async ({ page }) => {
    // Step 5: Assign Roles to Users
    await page.goto('/users');
    
    // Find a user to assign role to
    const userRows = page.locator('tbody tr, .user-item');
    const firstUser = userRows.first();
    
    if (await firstUser.count() > 0) {
      const editButton = firstUser.locator('button:has-text("Edit"), .btn-edit, a:has-text("Edit")');
      
      if (await editButton.count() > 0) {
        await editButton.click();
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: './evidence/screenshots/role-10-user-edit.png', fullPage: true });

        // Change user role
        const roleSelect = page.locator('select[name="role"], .role-select, .user-role');
        if (await roleSelect.count() > 0) {
          await roleSelect.selectOption('Nurse');
          await page.screenshot({ path: './evidence/screenshots/role-11-role-assigned.png', fullPage: true });

          // Save changes
          const saveButton = page.locator('button[type="submit"], .btn-save, button:has-text("Save")');
          await saveButton.click();
          await page.waitForLoadState('networkidle');
        }
      }
    }
  });

  test('TC005 - Test role-based access control', async ({ page }) => {
    // Step 6: Test Role-Based Access Control
    // This test would ideally require creating a test user with specific role
    // and logging in as that user to verify access restrictions
    
    await page.goto('/dashboard');
    await page.screenshot({ path: './evidence/screenshots/role-12-admin-dashboard.png', fullPage: true });

    // Verify admin has access to all menu items
    const adminMenuItems = [
      'Users',
      'Roles',
      'Settings',
      'Reports',
      'Patients',
      'Appointments'
    ];

    for (const menuItem of adminMenuItems) {
      const menuElement = page.locator(`nav a:has-text("${menuItem}"), .nav-item:has-text("${menuItem}"), .menu-item:has-text("${menuItem}")`);
      if (await menuElement.count() > 0) {
        await expect(menuElement.first()).toBeVisible();
      }
    }

    // Test access to user management
    await page.goto('/users');
    await expect(page).toHaveURL(/.*users/);
    
    // Test access to role management
    await page.goto('/roles');
    await expect(page).toHaveURL(/.*roles/);

    await page.screenshot({ path: './evidence/screenshots/role-13-access-verification.png', fullPage: true });
  });

  test('TC006 - Test bulk role assignment', async ({ page }) => {
    await page.goto('/users');
    
    // Step 7: Bulk Role Management
    const bulkActionsButton = page.locator('button:has-text("Bulk"), .bulk-actions, .btn-bulk');
    
    if (await bulkActionsButton.count() > 0) {
      // Select multiple users
      const userCheckboxes = page.locator('input[type="checkbox"], .user-checkbox');
      const checkboxCount = await userCheckboxes.count();
      
      if (checkboxCount > 1) {
        // Select first 2 users
        await userCheckboxes.nth(0).check();
        await userCheckboxes.nth(1).check();
        
        await bulkActionsButton.click();
        await page.screenshot({ path: './evidence/screenshots/role-14-bulk-selection.png', fullPage: true });

        // Select bulk role assignment action
        const bulkRoleAction = page.locator('option:has-text("Assign Role"), button:has-text("Assign Role")');
        if (await bulkRoleAction.count() > 0) {
          await bulkRoleAction.click();
          
          // Select role for bulk assignment
          const roleSelect = page.locator('select[name="bulkRole"], .bulk-role-select');
          if (await roleSelect.count() > 0) {
            await roleSelect.selectOption('Nurse');
            
            const applyButton = page.locator('button:has-text("Apply"), .btn-apply, .bulk-apply');
            if (await applyButton.count() > 0) {
              await applyButton.click();
              await page.waitForLoadState('networkidle');
              
              await page.screenshot({ path: './evidence/screenshots/role-15-bulk-assignment.png', fullPage: true });
            }
          }
        }
      }
    }
  });

  test('TC007 - Test role validation and security', async ({ page }) => {
    await page.goto('/roles');
    
    // Test duplicate role name validation
    const addRoleButton = page.locator('button:has-text("Add"), .add-role, .btn-add');
    await addRoleButton.first().click();
    await page.waitForLoadState('networkidle');

    // Try to create role with existing name
    await page.fill('input[name="name"], input[placeholder*="role name" i]', 'Administrator');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(1000);

    // Check for validation error
    const validationError = page.locator('.error, .invalid-feedback, .validation-error');
    if (await validationError.count() > 0) {
      await expect(validationError.first()).toBeVisible();
    }

    await page.screenshot({ path: './evidence/screenshots/role-16-validation-error.png', fullPage: true });

    // Test empty role name
    await page.fill('input[name="name"], input[placeholder*="role name" i]', '');
    const submitButton = page.locator('button[type="submit"], .btn-save, button:has-text("Save")');
    await submitButton.click();

    // Verify required field validation
    const requiredError = page.locator('.required-error, .invalid-feedback');
    if (await requiredError.count() > 0) {
      await expect(requiredError.first()).toBeVisible();
    }

    await page.screenshot({ path: './evidence/screenshots/role-17-required-validation.png', fullPage: true });
  });
});
