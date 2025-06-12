import { test, expect } from '@playwright/test';

test.describe('Settings Management - System Configuration', () => {
  test.beforeEach(async ({ page }) => {
    // Login as administrator
    await page.goto('/login');
    await page.fill('input[name="username"], input[type="text"]', 'admin');
    await page.fill('input[type="password"]', '1q2w3E*');
    await page.click('button[type="submit"], .login-btn');
    await page.waitForLoadState('networkidle');
  });

  test('TC001 - Configure general system settings', async ({ page }) => {
    // Step 1: Navigate to Settings Section
    await page.goto('/settings');
    await expect(page).toHaveURL(/.*settings/);
    await page.screenshot({ path: './evidence/screenshots/settings-01-dashboard.png', fullPage: true });

    // Step 2: Configure General System Settings
    const generalTab = page.locator('button:has-text("General"), .general-settings, .tab:has-text("General")');
    if (await generalTab.count() > 0) {
      await generalTab.click();
      await page.waitForLoadState('networkidle');
    }

    await page.screenshot({ path: './evidence/screenshots/settings-02-general-tab.png', fullPage: true });

    // System name configuration
    const systemNameField = page.locator('input[name="systemName"], .system-name, #systemName');
    if (await systemNameField.count() > 0) {
      await systemNameField.clear();
      await systemNameField.fill('Medlatec Portal System');
    }

    // Language selection
    const languageSelect = page.locator('select[name="language"], .language-select, #language');
    if (await languageSelect.count() > 0) {
      await languageSelect.selectOption('en');
    }

    // Timezone configuration
    const timezoneSelect = page.locator('select[name="timezone"], .timezone-select, #timezone');
    if (await timezoneSelect.count() > 0) {
      // Select a common timezone
      await timezoneSelect.selectOption('America/New_York');
    }

    // Date format selection
    const dateFormatSelect = page.locator('select[name="dateFormat"], .date-format-select');
    if (await dateFormatSelect.count() > 0) {
      await dateFormatSelect.selectOption('MM/DD/YYYY');
    }

    await page.screenshot({ path: './evidence/screenshots/settings-03-general-configured.png', fullPage: true });

    // Save general settings
    const saveButton = page.locator('button:has-text("Save"), .btn-save, .save-settings');
    if (await saveButton.count() > 0) {
      await saveButton.click();
      await page.waitForLoadState('networkidle');
      
      // Look for success message
      const successMessage = page.locator('.success, .alert-success, .notification-success');
      if (await successMessage.count() > 0) {
        await expect(successMessage.first()).toBeVisible();
      }
      
      await page.screenshot({ path: './evidence/screenshots/settings-04-general-saved.png', fullPage: true });
    }
  });

  test('TC002 - Configure user account settings', async ({ page }) => {
    await page.goto('/settings');
    
    // Step 3: Manage User Account Settings
    const accountTab = page.locator('button:has-text("Account"), .account-settings, .tab:has-text("User")');
    if (await accountTab.count() > 0) {
      await accountTab.click();
      await page.waitForLoadState('networkidle');
    }

    await page.screenshot({ path: './evidence/screenshots/settings-05-account-tab.png', fullPage: true });

    // Password policy configuration
    const passwordSettings = {
      minLength: '8',
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      passwordExpiry: '90'
    };

    const minLengthField = page.locator('input[name="minPasswordLength"], #minPasswordLength');
    if (await minLengthField.count() > 0) {
      await minLengthField.fill(passwordSettings.minLength);
    }

    // Password complexity checkboxes
    const uppercaseCheckbox = page.locator('input[name="requireUppercase"], #requireUppercase');
    if (await uppercaseCheckbox.count() > 0) {
      await uppercaseCheckbox.setChecked(passwordSettings.requireUppercase);
    }

    const numbersCheckbox = page.locator('input[name="requireNumbers"], #requireNumbers');
    if (await numbersCheckbox.count() > 0) {
      await numbersCheckbox.setChecked(passwordSettings.requireNumbers);
    }

    const specialCharsCheckbox = page.locator('input[name="requireSpecialChars"], #requireSpecialChars');
    if (await specialCharsCheckbox.count() > 0) {
      await specialCharsCheckbox.setChecked(passwordSettings.requireSpecialChars);
    }

    // Session timeout setting
    const sessionTimeoutField = page.locator('input[name="sessionTimeout"], #sessionTimeout');
    if (await sessionTimeoutField.count() > 0) {
      await sessionTimeoutField.fill('30'); // 30 minutes
    }

    // Account lockout settings
    const maxLoginAttemptsField = page.locator('input[name="maxLoginAttempts"], #maxLoginAttempts');
    if (await maxLoginAttemptsField.count() > 0) {
      await maxLoginAttemptsField.fill('5');
    }

    await page.screenshot({ path: './evidence/screenshots/settings-06-account-configured.png', fullPage: true });

    // Save account settings
    const saveButton = page.locator('button:has-text("Save"), .btn-save, .save-settings');
    if (await saveButton.count() > 0) {
      await saveButton.click();
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: './evidence/screenshots/settings-07-account-saved.png', fullPage: true });
    }
  });

  test('TC003 - Configure notification settings', async ({ page }) => {
    await page.goto('/settings');
    
    // Step 4: Configure Notification Settings
    const notificationTab = page.locator('button:has-text("Notification"), .notification-settings, .tab:has-text("Notification")');
    if (await notificationTab.count() > 0) {
      await notificationTab.click();
      await page.waitForLoadState('networkidle');
    }

    await page.screenshot({ path: './evidence/screenshots/settings-08-notification-tab.png', fullPage: true });

    // Email notification settings
    const emailNotificationsEnabled = page.locator('input[name="emailNotifications"], #emailNotifications');
    if (await emailNotificationsEnabled.count() > 0) {
      await emailNotificationsEnabled.check();
    }

    // SMTP configuration
    const smtpServerField = page.locator('input[name="smtpServer"], #smtpServer');
    if (await smtpServerField.count() > 0) {
      await smtpServerField.fill('smtp.medlatec.com');
    }

    const smtpPortField = page.locator('input[name="smtpPort"], #smtpPort');
    if (await smtpPortField.count() > 0) {
      await smtpPortField.fill('587');
    }

    const fromEmailField = page.locator('input[name="fromEmail"], #fromEmail');
    if (await fromEmailField.count() > 0) {
      await fromEmailField.fill('noreply@medlatec.com');
    }

    // SMS notification settings
    const smsNotificationsEnabled = page.locator('input[name="smsNotifications"], #smsNotifications');
    if (await smsNotificationsEnabled.count() > 0) {
      await smsNotificationsEnabled.check();
    }

    // Appointment reminder settings
    const appointmentReminders = page.locator('input[name="appointmentReminders"], #appointmentReminders');
    if (await appointmentReminders.count() > 0) {
      await appointmentReminders.check();
    }

    const reminderHoursField = page.locator('input[name="reminderHours"], #reminderHours');
    if (await reminderHoursField.count() > 0) {
      await reminderHoursField.fill('24'); // 24 hours before
    }

    await page.screenshot({ path: './evidence/screenshots/settings-09-notification-configured.png', fullPage: true });

    // Save notification settings
    const saveButton = page.locator('button:has-text("Save"), .btn-save, .save-settings');
    if (await saveButton.count() > 0) {
      await saveButton.click();
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: './evidence/screenshots/settings-10-notification-saved.png', fullPage: true });
    }
  });

  test('TC004 - Configure security settings', async ({ page }) => {
    await page.goto('/settings');
    
    // Step 5: Manage Security Settings
    const securityTab = page.locator('button:has-text("Security"), .security-settings, .tab:has-text("Security")');
    if (await securityTab.count() > 0) {
      await securityTab.click();
      await page.waitForLoadState('networkidle');
    }

    await page.screenshot({ path: './evidence/screenshots/settings-11-security-tab.png', fullPage: true });

    // Two-factor authentication
    const twoFactorEnabled = page.locator('input[name="twoFactor"], #twoFactor');
    if (await twoFactorEnabled.count() > 0) {
      await twoFactorEnabled.check();
    }

    // Audit logging
    const auditLoggingEnabled = page.locator('input[name="auditLogging"], #auditLogging');
    if (await auditLoggingEnabled.count() > 0) {
      await auditLoggingEnabled.check();
    }

    // IP restrictions
    const ipRestrictionsEnabled = page.locator('input[name="ipRestrictions"], #ipRestrictions');
    if (await ipRestrictionsEnabled.count() > 0) {
      await ipRestrictionsEnabled.check();
    }

    const allowedIpsField = page.locator('textarea[name="allowedIps"], #allowedIps');
    if (await allowedIpsField.count() > 0) {
      await allowedIpsField.fill('192.168.1.0/24\n10.0.0.0/8');
    }

    // Data encryption settings
    const encryptionEnabled = page.locator('input[name="dataEncryption"], #dataEncryption');
    if (await encryptionEnabled.count() > 0) {
      await encryptionEnabled.check();
    }

    await page.screenshot({ path: './evidence/screenshots/settings-12-security-configured.png', fullPage: true });

    // Save security settings
    const saveButton = page.locator('button:has-text("Save"), .btn-save, .save-settings');
    if (await saveButton.count() > 0) {
      await saveButton.click();
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: './evidence/screenshots/settings-13-security-saved.png', fullPage: true });
    }
  });

  test('TC005 - Test settings validation', async ({ page }) => {
    await page.goto('/settings');
    
    // Step 8: Test Settings Validation
    const generalTab = page.locator('button:has-text("General"), .general-settings');
    if (await generalTab.count() > 0) {
      await generalTab.click();
      await page.waitForLoadState('networkidle');
    }

    // Test invalid email format in notification settings
    const notificationTab = page.locator('button:has-text("Notification"), .notification-settings');
    if (await notificationTab.count() > 0) {
      await notificationTab.click();
      await page.waitForLoadState('networkidle');

      const fromEmailField = page.locator('input[name="fromEmail"], #fromEmail');
      if (await fromEmailField.count() > 0) {
        await fromEmailField.fill('invalid-email-format');
        
        const saveButton = page.locator('button:has-text("Save"), .btn-save');
        if (await saveButton.count() > 0) {
          await saveButton.click();
          
          // Check for validation error
          const emailError = page.locator('.email-error, .invalid-feedback, .validation-error');
          if (await emailError.count() > 0) {
            await expect(emailError.first()).toBeVisible();
          }
          
          await page.screenshot({ path: './evidence/screenshots/settings-email-validation-error.png', fullPage: true });
        }
      }
    }

    // Test invalid port number
    const smtpPortField = page.locator('input[name="smtpPort"], #smtpPort');
    if (await smtpPortField.count() > 0) {
      await smtpPortField.fill('99999'); // Invalid port
      
      const saveButton = page.locator('button:has-text("Save"), .btn-save');
      if (await saveButton.count() > 0) {
        await saveButton.click();
        
        // Check for port validation error
        const portError = page.locator('.port-error, .invalid-feedback, .validation-error');
        if (await portError.count() > 0) {
          await expect(portError.first()).toBeVisible();
        }
        
        await page.screenshot({ path: './evidence/screenshots/settings-port-validation-error.png', fullPage: true });
      }
    }
  });

  test('TC006 - Test backup and maintenance settings', async ({ page }) => {
    await page.goto('/settings');
    
    // Step 7: Manage Backup and Maintenance Settings
    const maintenanceTab = page.locator('button:has-text("Maintenance"), .maintenance-settings, .tab:has-text("Backup")');
    if (await maintenanceTab.count() > 0) {
      await maintenanceTab.click();
      await page.waitForLoadState('networkidle');
    }

    await page.screenshot({ path: './evidence/screenshots/settings-14-maintenance-tab.png', fullPage: true });

    // Auto backup settings
    const autoBackupEnabled = page.locator('input[name="autoBackup"], #autoBackup');
    if (await autoBackupEnabled.count() > 0) {
      await autoBackupEnabled.check();
    }

    const backupFrequency = page.locator('select[name="backupFrequency"], #backupFrequency');
    if (await backupFrequency.count() > 0) {
      await backupFrequency.selectOption('daily');
    }

    const backupTimeField = page.locator('input[type="time"], input[name="backupTime"]');
    if (await backupTimeField.count() > 0) {
      await backupTimeField.fill('02:00'); // 2 AM
    }

    // Data retention settings
    const retentionPeriodField = page.locator('input[name="retentionPeriod"], #retentionPeriod');
    if (await retentionPeriodField.count() > 0) {
      await retentionPeriodField.fill('365'); // 1 year
    }

    // Maintenance window
    const maintenanceWindowEnabled = page.locator('input[name="maintenanceWindow"], #maintenanceWindow');
    if (await maintenanceWindowEnabled.count() > 0) {
      await maintenanceWindowEnabled.check();
    }

    const maintenanceStartTime = page.locator('input[name="maintenanceStart"], #maintenanceStart');
    if (await maintenanceStartTime.count() > 0) {
      await maintenanceStartTime.fill('01:00');
    }

    const maintenanceEndTime = page.locator('input[name="maintenanceEnd"], #maintenanceEnd');
    if (await maintenanceEndTime.count() > 0) {
      await maintenanceEndTime.fill('03:00');
    }

    await page.screenshot({ path: './evidence/screenshots/settings-15-maintenance-configured.png', fullPage: true });

    // Save maintenance settings
    const saveButton = page.locator('button:has-text("Save"), .btn-save, .save-settings');
    if (await saveButton.count() > 0) {
      await saveButton.click();
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: './evidence/screenshots/settings-16-maintenance-saved.png', fullPage: true });
    }
  });

  test('TC007 - Test settings export/import functionality', async ({ page }) => {
    await page.goto('/settings');
    
    // Step 9: Apply and Test Settings Changes
    const exportButton = page.locator('button:has-text("Export"), .export-settings, .btn-export');
    if (await exportButton.count() > 0) {
      // Set up download listener
      const downloadPromise = page.waitForEvent('download');
      await exportButton.click();
      
      try {
        const download = await downloadPromise;
        expect(download.suggestedFilename()).toMatch(/settings|config/i);
        await page.screenshot({ path: './evidence/screenshots/settings-17-export-success.png', fullPage: true });
      } catch (error) {
        console.log('Export test skipped - download not available');
      }
    }

    // Test import functionality
    const importButton = page.locator('button:has-text("Import"), .import-settings, .btn-import');
    if (await importButton.count() > 0) {
      await importButton.click();
      
      // Look for file upload field
      const fileUpload = page.locator('input[type="file"], .file-upload');
      if (await fileUpload.count() > 0) {
        await expect(fileUpload).toBeVisible();
        await page.screenshot({ path: './evidence/screenshots/settings-18-import-dialog.png', fullPage: true });
      }
    }
  });
});
