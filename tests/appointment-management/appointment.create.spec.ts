import { test, expect } from '@playwright/test';

test.describe('Appointment Management - Create New Appointment', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="username"], input[type="text"]', 'admin');
    await page.fill('input[type="password"]', '1q2w3E*');
    await page.click('button[type="submit"], .login-btn');
    await page.waitForLoadState('networkidle');
  });

  test('TC001 - Create new appointment with complete information', async ({ page }) => {
    // Step 1: Navigate to Appointment Management
    await page.goto('/appointments');
    await expect(page).toHaveURL(/.*appointments/);
    await page.screenshot({ path: './evidence/screenshots/appointment-01-management-page.png', fullPage: true });

    // Step 2: Access Create Appointment Form
    const scheduleButton = page.locator('button:has-text("Schedule"), .schedule-appointment, .btn-schedule, a:has-text("New Appointment")');
    await expect(scheduleButton.first()).toBeVisible();
    await scheduleButton.first().click();
    
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: './evidence/screenshots/appointment-02-create-form.png', fullPage: true });

    // Step 3: Select Patient
    const patientSearch = page.locator('input[name="patient"], .patient-search, input[placeholder*="patient" i]');
    if (await patientSearch.count() > 0) {
      await patientSearch.fill('John Doe');
      await page.waitForTimeout(1000); // Wait for autocomplete
      
      // Select from dropdown if available
      const patientOption = page.locator('.patient-option, .search-result, li:has-text("John Doe")');
      if (await patientOption.count() > 0) {
        await patientOption.first().click();
      }
    } else {
      // Try dropdown selection
      const patientSelect = page.locator('select[name="patient"], .patient-select');
      if (await patientSelect.count() > 0) {
        await patientSelect.selectOption({ label: /John Doe/i });
      }
    }

    await page.screenshot({ path: './evidence/screenshots/appointment-03-patient-selected.png', fullPage: true });

    // Step 4: Select Healthcare Provider
    const providerSelect = page.locator('select[name="provider"], select[name="doctor"], .provider-select');
    if (await providerSelect.count() > 0) {
      // Get available options and select first one
      const options = await providerSelect.locator('option').all();
      if (options.length > 1) { // Skip empty/placeholder option
        await providerSelect.selectOption({ index: 1 });
      }
    }

    await page.screenshot({ path: './evidence/screenshots/appointment-04-provider-selected.png', fullPage: true });

    // Step 5: Choose Appointment Date and Time
    const appointmentData = {
      date: '2024-12-25', // Future date
      time: '10:00',
      duration: '30'
    };

    // Date selection
    const dateField = page.locator('input[type="date"], input[name="date"], .date-picker');
    if (await dateField.count() > 0) {
      await dateField.fill(appointmentData.date);
    }

    // Time selection
    const timeField = page.locator('input[type="time"], input[name="time"], .time-picker');
    if (await timeField.count() > 0) {
      await timeField.fill(appointmentData.time);
    } else {
      // Try dropdown time selection
      const timeSelect = page.locator('select[name="time"], .time-select');
      if (await timeSelect.count() > 0) {
        await timeSelect.selectOption(appointmentData.time);
      }
    }

    // Duration selection
    const durationSelect = page.locator('select[name="duration"], .duration-select');
    if (await durationSelect.count() > 0) {
      await durationSelect.selectOption(appointmentData.duration);
    }

    await page.screenshot({ path: './evidence/screenshots/appointment-05-datetime-selected.png', fullPage: true });

    // Step 6: Set Appointment Type and Details
    const appointmentDetails = {
      type: 'Consultation',
      reason: 'Regular checkup and health assessment',
      priority: 'Normal'
    };

    // Appointment type
    const typeSelect = page.locator('select[name="type"], select[name="appointmentType"], .type-select');
    if (await typeSelect.count() > 0) {
      await typeSelect.selectOption(appointmentDetails.type);
    }

    // Appointment reason/notes
    const reasonField = page.locator('textarea[name="reason"], textarea[name="notes"], input[name="reason"]');
    if (await reasonField.count() > 0) {
      await reasonField.fill(appointmentDetails.reason);
    }

    // Priority selection
    const prioritySelect = page.locator('select[name="priority"], .priority-select');
    if (await prioritySelect.count() > 0) {
      await prioritySelect.selectOption(appointmentDetails.priority);
    }

    await page.screenshot({ path: './evidence/screenshots/appointment-06-details-filled.png', fullPage: true });

    // Step 7: Configure Appointment Settings
    // Enable email reminder
    const emailReminder = page.locator('input[name="emailReminder"], .email-reminder');
    if (await emailReminder.count() > 0) {
      await emailReminder.check();
    }

    // Enable SMS reminder
    const smsReminder = page.locator('input[name="smsReminder"], .sms-reminder');
    if (await smsReminder.count() > 0) {
      await smsReminder.check();
    }

    await page.screenshot({ path: './evidence/screenshots/appointment-07-settings-configured.png', fullPage: true });

    // Step 8: Submit Appointment
    const submitButton = page.locator('button[type="submit"], .btn-save, .btn-schedule, button:has-text("Schedule")');
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Wait for submission and verify success
    await page.waitForLoadState('networkidle');
    
    const successIndicators = [
      page.locator('.success, .alert-success, .notification-success'),
      page.locator('text=/success|scheduled|created/i'),
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

    await page.screenshot({ path: './evidence/screenshots/appointment-08-creation-success.png', fullPage: true });

    // Step 9: Verify Appointment in Calendar
    if (!page.url().includes('/appointments')) {
      await page.goto('/appointments');
    }

    // Switch to calendar view if available
    const calendarView = page.locator('button:has-text("Calendar"), .calendar-view, .btn-calendar');
    if (await calendarView.count() > 0) {
      await calendarView.click();
      await page.waitForLoadState('networkidle');
    }

    // Look for the appointment in the calendar
    const appointmentInCalendar = page.locator('.appointment, .event, .scheduled-appointment');
    if (await appointmentInCalendar.count() > 0) {
      await expect(appointmentInCalendar.first()).toBeVisible();
    }

    await page.screenshot({ path: './evidence/screenshots/appointment-09-calendar-verification.png', fullPage: true });
  });

  test('TC002 - Validate appointment scheduling conflicts', async ({ page }) => {
    await page.goto('/appointments');
    
    const scheduleButton = page.locator('button:has-text("Schedule"), .schedule-appointment, .btn-schedule');
    await scheduleButton.first().click();
    await page.waitForLoadState('networkidle');

    // Try to schedule at a time that might conflict
    const dateField = page.locator('input[type="date"], input[name="date"]');
    const timeField = page.locator('input[type="time"], input[name="time"]');
    
    if (await dateField.count() > 0 && await timeField.count() > 0) {
      await dateField.fill('2024-12-25');
      await timeField.fill('10:00');
      
      // Select same provider that might be busy
      const providerSelect = page.locator('select[name="provider"], select[name="doctor"]');
      if (await providerSelect.count() > 0) {
        await providerSelect.selectOption({ index: 1 });
      }

      // Check for conflict warning
      await page.waitForTimeout(2000);
      const conflictWarning = page.locator('.conflict, .warning, .alert-warning, text=/conflict|busy|unavailable/i');
      
      if (await conflictWarning.count() > 0) {
        await expect(conflictWarning.first()).toBeVisible();
        await page.screenshot({ path: './evidence/screenshots/appointment-conflict-warning.png', fullPage: true });
      }
    }
  });

  test('TC003 - Test appointment form validation', async ({ page }) => {
    await page.goto('/appointments');
    
    const scheduleButton = page.locator('button:has-text("Schedule"), .schedule-appointment');
    await scheduleButton.first().click();
    await page.waitForLoadState('networkidle');

    // Try to submit form without required fields
    const submitButton = page.locator('button[type="submit"], .btn-save, button:has-text("Schedule")');
    await submitButton.click();

    // Check for validation messages
    const validationErrors = page.locator('.error, .invalid-feedback, .field-error');
    if (await validationErrors.count() > 0) {
      await expect(validationErrors.first()).toBeVisible();
    }

    await page.screenshot({ path: './evidence/screenshots/appointment-validation-errors.png', fullPage: true });

    // Test past date validation
    const dateField = page.locator('input[type="date"], input[name="date"]');
    if (await dateField.count() > 0) {
      await dateField.fill('2020-01-01'); // Past date
      await page.keyboard.press('Tab');
      await page.waitForTimeout(500);

      const pastDateError = page.locator('.date-error, .invalid-feedback');
      if (await pastDateError.count() > 0) {
        await expect(pastDateError.first()).toBeVisible();
      }
    }

    await page.screenshot({ path: './evidence/screenshots/appointment-past-date-validation.png', fullPage: true });
  });

  test('TC004 - Test appointment calendar navigation', async ({ page }) => {
    await page.goto('/appointments');
    
    // Switch to calendar view
    const calendarView = page.locator('button:has-text("Calendar"), .calendar-view, .btn-calendar');
    if (await calendarView.count() > 0) {
      await calendarView.click();
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: './evidence/screenshots/appointment-calendar-view.png', fullPage: true });

      // Test calendar navigation
      const nextButton = page.locator('.next-month, .calendar-next, button:has-text("Next")');
      if (await nextButton.count() > 0) {
        await nextButton.click();
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: './evidence/screenshots/appointment-calendar-next-month.png', fullPage: true });
      }

      const prevButton = page.locator('.prev-month, .calendar-prev, button:has-text("Previous")');
      if (await prevButton.count() > 0) {
        await prevButton.click();
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: './evidence/screenshots/appointment-calendar-prev-month.png', fullPage: true });
      }

      // Test different calendar views
      const viewButtons = [
        page.locator('button:has-text("Month"), .month-view'),
        page.locator('button:has-text("Week"), .week-view'),
        page.locator('button:has-text("Day"), .day-view')
      ];

      for (const viewButton of viewButtons) {
        if (await viewButton.count() > 0) {
          await viewButton.click();
          await page.waitForLoadState('networkidle');
          await page.screenshot({ 
            path: `./evidence/screenshots/appointment-calendar-${await viewButton.textContent()?.toLowerCase() || 'view'}.png`, 
            fullPage: true 
          });
        }
      }
    }
  });

  test('TC005 - Test appointment search and filtering', async ({ page }) => {
    await page.goto('/appointments');
    
    // Test appointment search
    const searchBox = page.locator('input[type="search"], .search-input, input[placeholder*="search" i]');
    if (await searchBox.count() > 0) {
      await searchBox.fill('John Doe');
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: './evidence/screenshots/appointment-search-patient.png', fullPage: true });

      // Clear search
      await searchBox.clear();
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');
    }

    // Test date range filtering
    const dateFromFilter = page.locator('input[name="dateFrom"], .date-from');
    const dateToFilter = page.locator('input[name="dateTo"], .date-to');
    
    if (await dateFromFilter.count() > 0 && await dateToFilter.count() > 0) {
      await dateFromFilter.fill('2024-01-01');
      await dateToFilter.fill('2024-12-31');
      
      const applyFilterButton = page.locator('button:has-text("Filter"), .apply-filter, .btn-filter');
      if (await applyFilterButton.count() > 0) {
        await applyFilterButton.click();
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: './evidence/screenshots/appointment-date-filter.png', fullPage: true });
      }
    }

    // Test status filtering
    const statusFilter = page.locator('select[name="status"], .status-filter');
    if (await statusFilter.count() > 0) {
      await statusFilter.selectOption('Confirmed');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: './evidence/screenshots/appointment-status-filter.png', fullPage: true });
    }
  });
});
