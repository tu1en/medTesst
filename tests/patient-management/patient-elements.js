// Patient Management Element Mapping
// This file contains all element selectors for patient management functionality

export const PatientElements = {
  // Navigation elements
  patientMenuLink: [
    'a[href*="patient"]',
    '.nav-item:has-text("Patient")',
    '.menu-item:has-text("Patient")',
    'nav a:has-text("Patient")'
  ],

  // Patient list page elements
  patientListContainer: [
    '.patient-list',
    '.data-table-container',
    '.patients-container',
    'table.patients'
  ],

  patientTable: [
    'table',
    '.data-table',
    '.patient-table',
    '.list-table'
  ],

  patientRows: [
    'tbody tr',
    '.patient-row',
    '.patient-item',
    '.data-row'
  ],

  // Search and filter elements
  searchInput: [
    'input[type="search"]',
    '.search-input',
    'input[placeholder*="search" i]',
    '.search-box input'
  ],

  searchButton: [
    'button[type="submit"]',
    '.search-btn',
    '.btn-search',
    'button:has-text("Search")'
  ],

  filterContainer: [
    '.filters',
    '.filter-container',
    '.search-filters',
    '.filter-panel'
  ],

  genderFilter: [
    'select[name="gender"]',
    '.gender-filter',
    '.filter-gender',
    'select:has(option:has-text("Male"))'
  ],

  bloodTypeFilter: [
    'select[name="bloodType"]',
    '.blood-type-filter',
    '.filter-blood-type',
    'select:has(option:has-text("O+"))'
  ],

  dateFilter: [
    'input[type="date"]',
    '.date-filter',
    '.filter-date',
    'input[name*="date"]'
  ],

  resetFilters: [
    'button:has-text("Reset")',
    '.btn-reset',
    '.clear-filters',
    '.reset-btn'
  ],

  // Create/Add patient elements
  addPatientButton: [
    'button:has-text("Add")',
    '.add-patient',
    '.btn-add',
    '.btn-new',
    'a:has-text("New Patient")',
    '.create-patient-btn'
  ],

  // Patient form elements
  patientForm: [
    '.patient-form',
    'form[name="patient"]',
    '.create-patient-form',
    '.patient-details-form'
  ],

  // Basic information fields
  firstNameInput: [
    'input[name="firstName"]',
    'input[placeholder*="first" i]',
    '.first-name input',
    '#firstName'
  ],

  lastNameInput: [
    'input[name="lastName"]',
    'input[placeholder*="last" i]',
    '.last-name input',
    '#lastName'
  ],

  dateOfBirthInput: [
    'input[name="dateOfBirth"]',
    'input[type="date"]',
    '.dob-input',
    '#dateOfBirth'
  ],

  genderSelect: [
    'select[name="gender"]',
    '.gender-select',
    '#gender',
    '.gender-dropdown'
  ],

  genderRadio: [
    'input[type="radio"][name="gender"]',
    '.gender-radio input',
    '.radio-gender input'
  ],

  phoneInput: [
    'input[name="phone"]',
    'input[type="tel"]',
    '.phone-input',
    '#phone'
  ],

  emailInput: [
    'input[name="email"]',
    'input[type="email"]',
    '.email-input',
    '#email'
  ],

  // Address fields
  streetInput: [
    'input[name="street"]',
    'input[placeholder*="street" i]',
    '.street-input',
    '#street'
  ],

  cityInput: [
    'input[name="city"]',
    'input[placeholder*="city" i]',
    '.city-input',
    '#city'
  ],

  stateInput: [
    'input[name="state"]',
    'input[placeholder*="state" i]',
    '.state-input',
    '#state'
  ],

  zipCodeInput: [
    'input[name="zipCode"]',
    'input[placeholder*="zip" i]',
    '.zip-input',
    '#zipCode'
  ],

  countryInput: [
    'input[name="country"]',
    'input[placeholder*="country" i]',
    '.country-input',
    '#country'
  ],

  // Medical information fields
  bloodTypeSelect: [
    'select[name="bloodType"]',
    '.blood-type-select',
    '#bloodType',
    '.medical-blood-type'
  ],

  allergiesInput: [
    'textarea[name="allergies"]',
    'input[name="allergies"]',
    '.allergies-input',
    '#allergies'
  ],

  medicalHistoryInput: [
    'textarea[name="medicalHistory"]',
    '.medical-history',
    '#medicalHistory'
  ],

  emergencyContactInput: [
    'input[name="emergencyContact"]',
    'textarea[name="emergencyContact"]',
    '.emergency-contact',
    '#emergencyContact'
  ],

  // Form action buttons
  saveButton: [
    'button[type="submit"]',
    '.btn-save',
    '.btn-submit',
    'button:has-text("Save")',
    'button:has-text("Create")'
  ],

  cancelButton: [
    'button:has-text("Cancel")',
    '.btn-cancel',
    '.cancel-btn',
    'a:has-text("Cancel")'
  ],

  // Action buttons in patient list
  viewButton: [
    'button:has-text("View")',
    '.btn-view',
    'a:has-text("View")',
    '.action-view'
  ],

  editButton: [
    'button:has-text("Edit")',
    '.btn-edit',
    'a:has-text("Edit")',
    '.action-edit'
  ],

  deleteButton: [
    'button:has-text("Delete")',
    '.btn-delete',
    '.action-delete',
    '.btn-remove'
  ],

  // Pagination elements
  paginationContainer: [
    '.pagination',
    '.pager',
    '.pagination-controls',
    '.page-navigation'
  ],

  nextPageButton: [
    'button:has-text("Next")',
    '.btn-next',
    '.pagination-next',
    '.page-next'
  ],

  previousPageButton: [
    'button:has-text("Previous")',
    '.btn-prev',
    '.pagination-prev',
    '.page-prev'
  ],

  pageSizeSelector: [
    'select[name="pageSize"]',
    '.page-size-selector select',
    '.items-per-page select'
  ],

  // Success/Error messages
  successMessage: [
    '.success',
    '.alert-success',
    '.notification-success',
    '[role="alert"]:has-text("success")'
  ],

  errorMessage: [
    '.error',
    '.alert-danger',
    '.alert-error',
    '.notification-error',
    '[role="alert"]:has-text("error")'
  ],

  validationError: [
    '.invalid-feedback',
    '.field-error',
    '.validation-error',
    '[aria-invalid="true"]'
  ],

  // Loading states
  loadingSpinner: [
    '.loading',
    '.spinner',
    '.loader',
    '.progress-indicator'
  ]
};

// Helper function to get element with fallback selectors
export function getElement(page, elementKey) {
  const selectors = PatientElements[elementKey];
  if (!selectors) {
    throw new Error(`Element key '${elementKey}' not found in PatientElements mapping`);
  }
  
  for (const selector of selectors) {
    const element = page.locator(selector);
    if (element) {
      return element;
    }
  }
  
  return page.locator(selectors[0]); // Return first selector as fallback
}
