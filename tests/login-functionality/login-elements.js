// Login Page Elements Configuration
export const LoginElements = {
  // Input fields
  usernameField: {
    selectors: [
      'input[name="username"]',
      'input[type="text"]',
      'input[placeholder*="username" i]',
      'input[placeholder*="user" i]',
      '#username',
      '.username input'
    ],
    description: 'Username/Email input field',
    required: true
  },
  
  passwordField: {
    selectors: [
      'input[name="password"]',
      'input[type="password"]',
      'input[placeholder*="password" i]',
      '#password',
      '.password input'
    ],
    description: 'Password input field', 
    required: true
  },
  
  // Buttons
  loginButton: {
    selectors: [
      'button[type="submit"]',
      'button:has-text("Login")',
      'button:has-text("Sign In")',
      '.btn-login',
      '.login-btn',
      'input[type="submit"]'
    ],
    description: 'Login submit button',
    required: true
  },
  
  forgotPasswordLink: {
    selectors: [
      'a:has-text("Forgot Password")',
      'a:has-text("Forgot")',
      '.forgot-password',
      '[href*="forgot"]'
    ],
    description: 'Forgot password link',
    required: false
  },
  
  // Form containers
  loginForm: {
    selectors: [
      'form',
      '.login-form',
      '.auth-form',
      '.signin-form'
    ],
    description: 'Login form container',
    required: true
  },
  
  // Feedback messages
  errorMessage: {
    selectors: [
      '.error',
      '.alert-danger',
      '.alert-error',
      '.error-message',
      '.invalid-feedback',
      '[role="alert"]'
    ],
    description: 'Error message display',
    required: false
  },
  
  successMessage: {
    selectors: [
      '.success',
      '.alert-success',
      '.success-message'
    ],
    description: 'Success message display',
    required: false
  },
  
  // Loading states
  loadingIndicator: {
    selectors: [
      '.loading',
      '.spinner',
      '.loader',
      '[aria-busy="true"]'
    ],
    description: 'Loading indicator',
    required: false
  }
};

// Test data configuration
export const LoginTestData = {
  validCredentials: {
    username: 'admin',
    password: '1q2w3E*'
  },
  
  invalidCredentials: [
    { username: 'invalid', password: 'invalid', description: 'Invalid username and password' },
    { username: 'admin', password: 'wrong', description: 'Valid username, invalid password' },
    { username: 'wrong', password: '1q2w3E*', description: 'Invalid username, valid password' },
    { username: '', password: '1q2w3E*', description: 'Empty username' },
    { username: 'admin', password: '', description: 'Empty password' },
    { username: '', password: '', description: 'Empty credentials' }
  ],
  
  specialCharacters: [
    { username: 'admin@#$', password: '1q2w3E*', description: 'Username with special chars' },
    { username: 'admin', password: 'pass@#$', description: 'Password with special chars' }
  ]
};

// Expected behaviors
export const LoginExpectedBehaviors = {
  validLogin: {
    shouldRedirect: true,
    expectedUrl: '/dashboard',
    shouldShowSuccessMessage: false,
    shouldClearForm: true
  },
  
  invalidLogin: {
    shouldRedirect: false,
    shouldShowErrorMessage: true,
    shouldPreserveUsername: true,
    shouldClearPassword: true,
    shouldFocusPasswordField: false
  },
  
  emptyFields: {
    shouldShowValidationMessage: true,
    shouldPreventSubmission: true,
    shouldHighlightRequiredFields: false
  }
};
