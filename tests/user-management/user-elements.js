// User Management Element Mapping
// This file contains all element selectors for user management functionality

export const UserElements = {
  // Navigation elements
  userMenuLink: [
    'a[href*="user"]',
    '.nav-item:has-text("User")',
    '.menu-item:has-text("User")',
    'nav a:has-text("User")'
  ],

  roleMenuLink: [
    'a[href*="role"]',
    '.nav-item:has-text("Role")',
    '.menu-item:has-text("Role")',
    'nav a:has-text("Role")'
  ],

  // User list page elements
  userListContainer: [
    '.user-list',
    '.users-container',
    'table.users',
    '.data-table-container'
  ],

  userTable: [
    'table',
    '.data-table',
    '.user-table',
    '.list-table'
  ],

  userRows: [
    'tbody tr',
    '.user-row',
    '.user-item',
    '.data-row'
  ],

  // Add user elements
  addUserButton: [
    'button:has-text("Add")',
    '.add-user',
    '.btn-add',
    '.btn-new',
    'a:has-text("New User")',
    '.create-user-btn'
  ],

  // User form elements
  userForm: [
    '.user-form',
    'form[name="user"]',
    '.create-user-form',
    '.user-details-form'
  ],

  // Basic user information fields
  usernameInput: [
    'input[name="username"]',
    'input[placeholder*="username" i]',
    '.username-input',
    '#username'
  ],

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

  emailInput: [
    'input[name="email"]',
    'input[type="email"]',
    '.email-input',
    '#email'
  ],

  employeeIdInput: [
    'input[name="employeeId"]',
    'input[placeholder*="employee" i]',
    '.employee-id-input',
    '#employeeId'
  ],

  departmentSelect: [
    'select[name="department"]',
    '.department-select',
    '#department',
    '.dept-dropdown'
  ],

  departmentInput: [
    'input[name="department"]',
    'input[placeholder*="department" i]',
    '.department-input',
    '#department'
  ],

  // Authentication fields
  passwordInput: [
    'input[name="password"]',
    'input[type="password"]',
    '.password-input',
    '#password'
  ],

  confirmPasswordInput: [
    'input[name="confirmPassword"]',
    'input[name="passwordConfirm"]',
    '.confirm-password',
    '#confirmPassword'
  ],

  forcePasswordChangeCheckbox: [
    'input[name="forcePasswordChange"]',
    '.force-password-change',
    '#forcePasswordChange'
  ],

  // Role assignment elements
  roleSelect: [
    'select[name="role"]',
    '.role-select',
    '.user-role',
    '#role'
  ],

  permissionCheckboxes: [
    '.permissions input[type="checkbox"]',
    '.permission-list input',
    '.user-permissions input'
  ],

  // Contact information fields
  phoneInput: [
    'input[name="phone"]',
    'input[type="tel"]',
    '.phone-input',
    '#phone'
  ],

  addressInput: [
    'input[name="address"]',
    'textarea[name="address"]',
    '.address-input',
    '#address'
  ],

  // Professional information
  specializationInput: [
    'input[name="specialization"]',
    '.specialization-input',
    '#specialization'
  ],

  licenseNumberInput: [
    'input[name="licenseNumber"]',
    '.license-input',
    '#licenseNumber'
  ],

  // Status and settings
  statusSelect: [
    'select[name="status"]',
    '.status-select',
    '#status'
  ],

  profilePictureUpload: [
    'input[type="file"][name="profilePicture"]',
    '.profile-picture-upload',
    '#profilePicture'
  ],

  // Form action buttons
  saveButton: [
    'button[type="submit"]',
    '.btn-save',
    '.btn-create',
    'button:has-text("Save")',
    'button:has-text("Create")'
  ],

  cancelButton: [
    'button:has-text("Cancel")',
    '.btn-cancel',
    '.cancel-btn',
    'a:has-text("Cancel")'
  ],

  // User list action buttons
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

  viewButton: [
    'button:has-text("View")',
    '.btn-view',
    'a:has-text("View")',
    '.action-view'
  ],

  // Role management elements
  roleListContainer: [
    '.role-list',
    '.roles-container',
    'table.roles',
    '.role-table'
  ],

  addRoleButton: [
    'button:has-text("Add")',
    '.add-role',
    '.btn-add',
    'a:has-text("New Role")'
  ],

  roleForm: [
    '.role-form',
    'form[name="role"]',
    '.create-role-form'
  ],

  roleNameInput: [
    'input[name="name"]',
    'input[placeholder*="role name" i]',
    '.role-name-input',
    '#roleName'
  ],

  roleDescriptionInput: [
    'textarea[name="description"]',
    'input[name="description"]',
    '.role-description',
    '#roleDescription'
  ],

  permissionsList: [
    '.permissions',
    '.permission-list',
    '.role-permissions',
    '.permissions-container'
  ],

  // Bulk operations
  bulkActionsButton: [
    'button:has-text("Bulk")',
    '.bulk-actions',
    '.btn-bulk'
  ],

  userCheckboxes: [
    'input[type="checkbox"]',
    '.user-checkbox',
    '.row-checkbox'
  ],

  bulkRoleSelect: [
    'select[name="bulkRole"]',
    '.bulk-role-select',
    '.bulk-role-dropdown'
  ],

  bulkApplyButton: [
    'button:has-text("Apply")',
    '.btn-apply',
    '.bulk-apply'
  ],

  // Search and filter elements
  searchInput: [
    'input[type="search"]',
    '.search-input',
    'input[placeholder*="search" i]',
    '.search-box input'
  ],

  roleFilter: [
    'select[name="roleFilter"]',
    '.role-filter',
    '.filter-role'
  ],

  statusFilter: [
    'select[name="statusFilter"]',
    '.status-filter',
    '.filter-status'
  ],

  departmentFilter: [
    'select[name="departmentFilter"]',
    '.department-filter',
    '.filter-department'
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

  // Specific validation messages
  usernameExistsError: [
    '.username-error',
    '.error:near(input[name="username"])',
    '.validation-error:has-text("username")'
  ],

  emailExistsError: [
    '.email-error',
    '.error:near(input[type="email"])',
    '.validation-error:has-text("email")'
  ],

  passwordError: [
    '.password-error',
    '.error:near(input[type="password"])',
    '.validation-error:has-text("password")'
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
export function getUserElement(page, elementKey) {
  const selectors = UserElements[elementKey];
  if (!selectors) {
    throw new Error(`Element key '${elementKey}' not found in UserElements mapping`);
  }
  
  for (const selector of selectors) {
    const element = page.locator(selector);
    if (element) {
      return element;
    }
  }
  
  return page.locator(selectors[0]); // Return first selector as fallback
}
