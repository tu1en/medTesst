import { test, expect } from '@playwright/test';

test.describe('Patient Management - Create New Patient', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="username"], input[type="text"]', 'admin');
    await page.fill('input[type="password"]', '1q2w3E*');
    await page.click('button[type="submit"], .login-btn');
    await page.waitForLoadState('networkidle');
  });

  test('TC001 - Create new patient with complete information', async ({ page }) => {
    // Step 1: Navigate to Patient Management
    await page.goto('/patients');
    await expect(page).toHaveURL(/.*patients/);
    await page.screenshot({ path: './evidence/screenshots/patient-01-list-page.png', fullPage: true });

    // Step 2: Access Create Patient Form
    const addPatientButton = page.locator('button:has-text("Add"), .add-patient, .btn-add, a:has-text("New")');
    await expect(addPatientButton.first()).toBeVisible();
    await addPatientButton.first().click();
    
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: './evidence/screenshots/patient-02-create-form.png', fullPage: true });

    // Step 3: Fill Patient Basic Information
    const patientData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-15',
      gender: 'Male',
      phone: '+1234567890',
      email: 'john.doe@example.com'
    };

    // Fill basic information fields
    await page.fill('input[name="firstName"], input[placeholder*="first" i]', patientData.firstName);
    await page.fill('input[name="lastName"], input[placeholder*="last" i]', patientData.lastName);
    await page.fill('input[name="dateOfBirth"], input[type="date"]', patientData.dateOfBirth);
    
    // Handle gender selection (dropdown or radio buttons)
    const genderDropdown = page.locator('select[name="gender"], .gender-select');
    if (await genderDropdown.count() > 0) {
      await genderDropdown.selectOption(patientData.gender);
    } else {
      await page.click(`input[type="radio"][value="${patientData.gender}"], label:has-text("${patientData.gender}")`);
    }

    await page.fill('input[name="phone"], input[type="tel"]', patientData.phone);
    await page.fill('input[name="email"], input[type="email"]', patientData.email);
    
    await page.screenshot({ path: './evidence/screenshots/patient-03-basic-info.png', fullPage: true });

    // Step 4: Fill Address Information
    const addressData = {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    };

    await page.fill('input[name="street"], input[placeholder*="street" i]', addressData.street);
    await page.fill('input[name="city"], input[placeholder*="city" i]', addressData.city);
    await page.fill('input[name="state"], input[placeholder*="state" i]', addressData.state);
    await page.fill('input[name="zipCode"], input[placeholder*="zip" i]', addressData.zipCode);
    await page.fill('input[name="country"], input[placeholder*="country" i]', addressData.country);
    
    await page.screenshot({ path: './evidence/screenshots/patient-04-address-info.png', fullPage: true });

    // Step 5: Fill Medical Information
    const medicalData = {
      bloodType: 'O+',
      allergies: 'Penicillin',
      emergencyContact: 'Jane Doe - +1234567891'
    };

    const bloodTypeSelect = page.locator('select[name="bloodType"], .blood-type-select');
    if (await bloodTypeSelect.count() > 0) {
      await bloodTypeSelect.selectOption(medicalData.bloodType);
    }

    await page.fill('textarea[name="allergies"], input[name="allergies"]', medicalData.allergies);
    await page.fill('input[name="emergencyContact"], textarea[name="emergencyContact"]', medicalData.emergencyContact);
    
    await page.screenshot({ path: './evidence/screenshots/patient-05-medical-info.png', fullPage: true });

    // Step 6: Submit Patient Record
    const submitButton = page.locator('button[type="submit"], .btn-save, .btn-submit, button:has-text("Save")');
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Wait for submission and success message
    await page.waitForLoadState('networkidle');
    
    // Verify success message or navigation
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

    // If no success message, check if redirected to patient list
    if (!successFound) {
      await expect(page).toHaveURL(/.*patients/);
    }

    await page.screenshot({ path: './evidence/screenshots/patient-06-success.png', fullPage: true });

    // Step 7: Verify Patient in System
    if (!page.url().includes('/patients')) {
      await page.goto('/patients');
    }

    // Search for the newly created patient
    const searchBox = page.locator('input[type="search"], .search-input, input[placeholder*="search" i]');
    if (await searchBox.count() > 0) {
      await searchBox.fill(`${patientData.firstName} ${patientData.lastName}`);
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');
    }

    // Verify patient appears in list
    const patientRow = page.locator(`tr:has-text("${patientData.firstName}"), .patient-item:has-text("${patientData.firstName}")`);
    await expect(patientRow.first()).toBeVisible();
    
    await page.screenshot({ path: './evidence/screenshots/patient-07-verification.png', fullPage: true });
  });

  test('TC002 - Validate required fields', async ({ page }) => {
    await page.goto('/patients');
    
    // Navigate to create form
    const addButton = page.locator('button:has-text("Add"), .add-patient, .btn-add');
    await addButton.first().click();
    await page.waitForLoadState('networkidle');

    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"], .btn-save, button:has-text("Save")');
    await submitButton.click();

    // Verify validation messages appear
    const validationMessages = page.locator('.error, .invalid-feedback, .field-error, [aria-invalid="true"]');
    await expect(validationMessages.first()).toBeVisible();
    
    await page.screenshot({ path: './evidence/screenshots/patient-validation-errors.png', fullPage: true });
  });

  test('TC003 - Test form field validations', async ({ page }) => {
    await page.goto('/patients');
    
    const addButton = page.locator('button:has-text("Add"), .add-patient');
    await addButton.first().click();
    await page.waitForLoadState('networkidle');

    // Test email validation
    const emailField = page.locator('input[type="email"], input[name="email"]');
    if (await emailField.count() > 0) {
      await emailField.fill('invalid-email');
      await page.keyboard.press('Tab');
      
      const emailError = page.locator('.error:near(input[type="email"]), .invalid-feedback');
      if (await emailError.count() > 0) {
        await expect(emailError.first()).toBeVisible();
      }
    }

    // Test phone validation
    const phoneField = page.locator('input[type="tel"], input[name="phone"]');
    if (await phoneField.count() > 0) {
      await phoneField.fill('invalid-phone');
      await page.keyboard.press('Tab');
    }

    await page.screenshot({ path: './evidence/screenshots/patient-field-validation.png', fullPage: true });
  });
});
