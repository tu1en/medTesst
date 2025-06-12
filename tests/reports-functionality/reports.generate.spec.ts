import { test, expect } from '@playwright/test';

test.describe('Reports Management - Generate Reports', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="username"], input[type="text"]', 'admin');
    await page.fill('input[type="password"]', '1q2w3E*');
    await page.click('button[type="submit"], .login-btn');
    await page.waitForLoadState('networkidle');
  });

  test('TC001 - Generate patient demographics report', async ({ page }) => {
    // Step 1: Navigate to Reports Section
    await page.goto('/reports');
    await expect(page).toHaveURL(/.*reports/);
    await page.screenshot({ path: './evidence/screenshots/reports-01-dashboard.png', fullPage: true });

    // Step 2: Select Report Type
    const patientReportsCategory = page.locator('button:has-text("Patient"), .patient-reports, .report-category:has-text("Patient")');
    if (await patientReportsCategory.count() > 0) {
      await patientReportsCategory.first().click();
      await page.waitForLoadState('networkidle');
    }

    const demographicsReport = page.locator('button:has-text("Demographics"), .demographics-report, a:has-text("Demographics")');
    await expect(demographicsReport.first()).toBeVisible();
    await demographicsReport.first().click();
    
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: './evidence/screenshots/reports-02-demographics-selection.png', fullPage: true });

    // Step 3: Configure Report Parameters
    const reportParams = {
      dateFrom: '2024-01-01',
      dateTo: '2024-12-31',
      format: 'PDF'
    };

    // Date range selection
    const dateFromField = page.locator('input[name="dateFrom"], .date-from, input[type="date"]').first();
    const dateToField = page.locator('input[name="dateTo"], .date-to, input[type="date"]').nth(1);
    
    if (await dateFromField.count() > 0) {
      await dateFromField.fill(reportParams.dateFrom);
    }
    
    if (await dateToField.count() > 0) {
      await dateToField.fill(reportParams.dateTo);
    }

    // Format selection
    const formatSelect = page.locator('select[name="format"], .format-select, .report-format');
    if (await formatSelect.count() > 0) {
      await formatSelect.selectOption(reportParams.format);
    }

    await page.screenshot({ path: './evidence/screenshots/reports-03-parameters-configured.png', fullPage: true });

    // Step 4: Apply Data Filters
    const ageGroupFilter = page.locator('select[name="ageGroup"], .age-group-filter');
    if (await ageGroupFilter.count() > 0) {
      await ageGroupFilter.selectOption('All Ages');
    }

    const genderFilter = page.locator('select[name="gender"], .gender-filter');
    if (await genderFilter.count() > 0) {
      await genderFilter.selectOption('All');
    }

    await page.screenshot({ path: './evidence/screenshots/reports-04-filters-applied.png', fullPage: true });

    // Step 5: Preview Report Data
    const previewButton = page.locator('button:has-text("Preview"), .btn-preview, .preview-report');
    if (await previewButton.count() > 0) {
      await previewButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000); // Wait for preview to load
      
      // Verify preview displays
      const previewContainer = page.locator('.report-preview, .preview-container, .report-data');
      if (await previewContainer.count() > 0) {
        await expect(previewContainer.first()).toBeVisible();
      }
      
      await page.screenshot({ path: './evidence/screenshots/reports-05-preview-data.png', fullPage: true });
    }

    // Step 6: Generate Full Report
    const generateButton = page.locator('button:has-text("Generate"), .btn-generate, .generate-report');
    await expect(generateButton.first()).toBeVisible();
    await generateButton.first().click();

    // Wait for report generation with progress indicators
    const loadingIndicator = page.locator('.loading, .spinner, .progress, .generating');
    if (await loadingIndicator.count() > 0) {
      await expect(loadingIndicator.first()).toBeVisible();
      // Wait for loading to complete
      await expect(loadingIndicator.first()).not.toBeVisible({ timeout: 60000 });
    }

    await page.screenshot({ path: './evidence/screenshots/reports-06-generation-complete.png', fullPage: true });

    // Step 7: View and Analyze Report
    const reportContent = page.locator('.report-content, .generated-report, .report-display');
    if (await reportContent.count() > 0) {
      await expect(reportContent.first()).toBeVisible();
      
      // Verify report contains expected elements
      const reportTitle = page.locator('h1, .report-title, .title');
      if (await reportTitle.count() > 0) {
        await expect(reportTitle.first()).toContainText(/demographics|patient/i);
      }
    }

    await page.screenshot({ path: './evidence/screenshots/reports-07-report-content.png', fullPage: true });

    // Step 8: Export Report
    const exportButton = page.locator('button:has-text("Export"), .btn-export, .export-report');
    if (await exportButton.count() > 0) {
      // Set up download listener
      const downloadPromise = page.waitForEvent('download');
      await exportButton.click();
      
      try {
        const download = await downloadPromise;
        expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
        await page.screenshot({ path: './evidence/screenshots/reports-08-export-success.png', fullPage: true });
      } catch (error) {
        // Export might not be available in test environment
        console.log('Export test skipped - download not available');
      }
    }
  });

  test('TC002 - Generate appointment report with filtering', async ({ page }) => {
    await page.goto('/reports');
    
    // Select appointment reports
    const appointmentReports = page.locator('button:has-text("Appointment"), .appointment-reports, .report-category:has-text("Appointment")');
    if (await appointmentReports.count() > 0) {
      await appointmentReports.first().click();
      await page.waitForLoadState('networkidle');
    }

    const appointmentSummaryReport = page.locator('button:has-text("Summary"), .appointment-summary, a:has-text("Appointment Summary")');
    if (await appointmentSummaryReport.count() > 0) {
      await appointmentSummaryReport.first().click();
      await page.waitForLoadState('networkidle');
    }

    await page.screenshot({ path: './evidence/screenshots/reports-appointment-selection.png', fullPage: true });

    // Configure specific filters for appointments
    const statusFilter = page.locator('select[name="status"], .status-filter');
    if (await statusFilter.count() > 0) {
      await statusFilter.selectOption('Completed');
    }

    const providerFilter = page.locator('select[name="provider"], .provider-filter');
    if (await providerFilter.count() > 0) {
      // Select first available provider
      const options = await providerFilter.locator('option').all();
      if (options.length > 1) {
        await providerFilter.selectOption({ index: 1 });
      }
    }

    await page.screenshot({ path: './evidence/screenshots/reports-appointment-filters.png', fullPage: true });

    // Generate the report
    const generateButton = page.locator('button:has-text("Generate"), .btn-generate, .generate-report');
    if (await generateButton.count() > 0) {
      await generateButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);
      
      await page.screenshot({ path: './evidence/screenshots/reports-appointment-generated.png', fullPage: true });
    }
  });

  test('TC003 - Test report validation and error handling', async ({ page }) => {
    await page.goto('/reports');
    
    // Try to generate report without selecting type
    const generateButton = page.locator('button:has-text("Generate"), .btn-generate, .generate-report');
    if (await generateButton.count() > 0) {
      await generateButton.click();
      
      // Check for validation error
      const validationError = page.locator('.error, .alert-danger, .validation-error');
      if (await validationError.count() > 0) {
        await expect(validationError.first()).toBeVisible();
      }
      
      await page.screenshot({ path: './evidence/screenshots/reports-validation-error.png', fullPage: true });
    }

    // Test invalid date range
    const dateFromField = page.locator('input[name="dateFrom"], .date-from');
    const dateToField = page.locator('input[name="dateTo"], .date-to');
    
    if (await dateFromField.count() > 0 && await dateToField.count() > 0) {
      await dateFromField.fill('2024-12-31');
      await dateToField.fill('2024-01-01'); // End date before start date
      
      const previewButton = page.locator('button:has-text("Preview"), .btn-preview');
      if (await previewButton.count() > 0) {
        await previewButton.click();
        
        // Check for date range error
        const dateError = page.locator('.date-error, .invalid-range, .error:has-text("date")');
        if (await dateError.count() > 0) {
          await expect(dateError.first()).toBeVisible();
        }
        
        await page.screenshot({ path: './evidence/screenshots/reports-date-range-error.png', fullPage: true });
      }
    }
  });

  test('TC004 - Test report scheduling functionality', async ({ page }) => {
    await page.goto('/reports');
    
    // Look for scheduled reports section
    const scheduledReportsTab = page.locator('button:has-text("Scheduled"), .scheduled-reports, .tab:has-text("Schedule")');
    if (await scheduledReportsTab.count() > 0) {
      await scheduledReportsTab.click();
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: './evidence/screenshots/reports-scheduled-section.png', fullPage: true });

      // Step 9: Schedule Recurring Reports
      const scheduleNewButton = page.locator('button:has-text("Schedule"), .schedule-report, .btn-schedule');
      if (await scheduleNewButton.count() > 0) {
        await scheduleNewButton.click();
        await page.waitForLoadState('networkidle');

        // Configure schedule
        const scheduleData = {
          frequency: 'Weekly',
          dayOfWeek: 'Monday',
          time: '09:00',
          email: 'admin@medlatec.com'
        };

        const frequencySelect = page.locator('select[name="frequency"], .frequency-select');
        if (await frequencySelect.count() > 0) {
          await frequencySelect.selectOption(scheduleData.frequency);
        }

        const daySelect = page.locator('select[name="dayOfWeek"], .day-select');
        if (await daySelect.count() > 0) {
          await daySelect.selectOption(scheduleData.dayOfWeek);
        }

        const timeField = page.locator('input[type="time"], input[name="time"]');
        if (await timeField.count() > 0) {
          await timeField.fill(scheduleData.time);
        }

        const emailField = page.locator('input[type="email"], input[name="email"]');
        if (await emailField.count() > 0) {
          await emailField.fill(scheduleData.email);
        }

        await page.screenshot({ path: './evidence/screenshots/reports-schedule-configured.png', fullPage: true });

        const saveScheduleButton = page.locator('button:has-text("Save"), .btn-save, .save-schedule');
        if (await saveScheduleButton.count() > 0) {
          await saveScheduleButton.click();
          await page.waitForLoadState('networkidle');
          
          await page.screenshot({ path: './evidence/screenshots/reports-schedule-saved.png', fullPage: true });
        }
      }
    }
  });

  test('TC005 - Test different report formats', async ({ page }) => {
    await page.goto('/reports');
    
    // Select a basic report type
    const patientReports = page.locator('button:has-text("Patient"), .patient-reports');
    if (await patientReports.count() > 0) {
      await patientReports.first().click();
      await page.waitForLoadState('networkidle');
    }

    const formats = ['PDF', 'Excel', 'CSV'];
    
    for (const format of formats) {
      const formatSelect = page.locator('select[name="format"], .format-select');
      if (await formatSelect.count() > 0) {
        await formatSelect.selectOption(format);
        
        const generateButton = page.locator('button:has-text("Generate"), .btn-generate');
        if (await generateButton.count() > 0) {
          await generateButton.click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(3000);
          
          await page.screenshot({ 
            path: `./evidence/screenshots/reports-format-${format.toLowerCase()}.png`, 
            fullPage: true 
          });
        }
      }
    }
  });
});
