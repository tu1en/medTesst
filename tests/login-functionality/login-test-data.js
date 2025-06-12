/**
 * Login Test Data
 * Contains test data sets, expected behaviors, and validation rules for login functionality
 * Following MCP approach of data-driven testing
 */

export const LoginTestData = {
  // Valid login credentials
  validCredentials: {
    username: 'admin',
    password: '1q2w3E*',
    description: 'Valid admin credentials'
  },

  // Invalid credential test cases
  invalidCredentials: [
    {
      username: 'invaliduser',
      password: '1q2w3E*',
      description: 'Invalid username with valid password',
      expectedError: 'Invalid credentials'
    },
    {
      username: 'admin',
      password: 'wrongpassword',
      description: 'Valid username with invalid password',
      expectedError: 'Invalid credentials'
    },
    {
      username: 'wronguser',
      password: 'wrongpass',
      description: 'Both username and password invalid',
      expectedError: 'Invalid credentials'
    },
    {
      username: '',
      password: '1q2w3E*',
      description: 'Empty username field',
      expectedError: 'Username required'
    },
    {
      username: 'admin',
      password: '',
      description: 'Empty password field',
      expectedError: 'Password required'
    },
    {
      username: '',
      password: '',
      description: 'Both fields empty',
      expectedError: 'Username and password required'
    }
  ],

  // Security test cases
  securityTestCases: [
    {
      username: "' OR '1'='1",
      password: "' OR '1'='1",
      description: 'SQL injection attempt',
      shouldFail: true
    },
    {
      username: '<script>alert("xss")</script>',
      password: 'normalpass',
      description: 'XSS injection in username',
      shouldFail: true
    },
    {
      username: 'admin',
      password: '<img src=x onerror=alert("xss")>',
      description: 'XSS injection in password',
      shouldFail: true
    },
    {
      username: '../../../etc/passwd',
      password: 'password',
      description: 'Path traversal attempt',
      shouldFail: true
    }
  ],

  // Edge case test data
  edgeCases: [
    {
      username: 'a'.repeat(1000),
      password: '1q2w3E*',
      description: 'Very long username (1000 chars)',
      shouldFail: true
    },
    {
      username: 'admin',
      password: 'b'.repeat(1000),
      description: 'Very long password (1000 chars)',
      shouldFail: true
    },
    {
      username: 'ADMIN',
      password: '1q2w3E*',
      description: 'Username case sensitivity test (uppercase)',
      expectedBehavior: 'depends_on_implementation'
    },
    {
      username: 'Admin',
      password: '1q2w3E*',
      description: 'Username case sensitivity test (mixed case)',
      expectedBehavior: 'depends_on_implementation'
    },
    {
      username: 'admin',
      password: '1Q2W3E*',
      description: 'Password case sensitivity test',
      shouldFail: true
    },
    {
      username: ' admin ',
      password: '1q2w3E*',
      description: 'Username with leading/trailing spaces',
      expectedBehavior: 'should_trim_spaces'
    }
  ],

  // Performance test data
  performanceTests: [
    {
      description: 'Rapid repeated login attempts',
      attempts: 10,
      delay: 100, // milliseconds between attempts
      expectedBehavior: 'should_handle_gracefully'
    },
    {
      description: 'Multiple concurrent login attempts',
      concurrent: 5,
      expectedBehavior: 'should_handle_concurrent_requests'
    }
  ]
};

// Expected application behaviors
export const LoginExpectedBehaviors = {
  successfulLogin: {
    shouldRedirect: true,
    redirectPattern: /^(?!.*\/login)/,  // Should not contain /login
    redirectTimeout: 5000, // max time to wait for redirect
    shouldClearForm: true,
    shouldShowSuccessMessage: false, // usually redirect is immediate
    preserveSession: true
  },

  failedLogin: {
    shouldRedirect: false,
    shouldRemainOnLoginPage: true,
    shouldShowErrorMessage: true,
    errorMessageTimeout: 3000,
    shouldClearPassword: true, // for security
    shouldPreserveUsername: true, // for user convenience
    shouldFocusPasswordField: false, // depends on implementation
    maxErrorDisplayTime: 10000
  },

  formValidation: {
    emptyUsername: {
      shouldPreventSubmission: true,
      shouldShowValidation: true,
      validationMessage: /username.*required/i
    },
    emptyPassword: {
      shouldPreventSubmission: true,
      shouldShowValidation: true,
      validationMessage: /password.*required/i
    },
    bothEmpty: {
      shouldPreventSubmission: true,
      shouldShowValidation: true
    }
  },

  security: {
    shouldSanitizeInputs: true,
    shouldNotEchoPasswords: true,
    shouldNotExposeSystemInfo: true,
    shouldLogFailedAttempts: true,
    rateLimiting: {
      enabled: false, // may or may not be implemented
      maxAttempts: 5,
      lockoutTime: 300000 // 5 minutes
    }
  },

  performance: {
    maxLoadTime: 5000, // 5 seconds
    maxResponseTime: 3000, // 3 seconds for login response
    shouldNotBlock: true
  }
};

// Test environment configuration
export const TestEnvironment = {
  baseUrl: 'https://medlatec-portal-fe.vercel.app',
  loginPath: '/login',
  expectedDashboardPaths: [
    '/dashboard',
    '/main',
    '/home',
    '/',
    '/admin'
  ],
  
  // Browser configurations for testing
  browsers: [
    { name: 'chromium', headless: false },
    { name: 'firefox', headless: false },
    { name: 'webkit', headless: false }
  ],

  // Viewport configurations for responsive testing
  viewports: [
    { width: 1920, height: 1080, name: 'desktop-fhd' },
    { width: 1366, height: 768, name: 'desktop-hd' },
    { width: 1024, height: 768, name: 'tablet-landscape' },
    { width: 768, height: 1024, name: 'tablet-portrait' },
    { width: 414, height: 896, name: 'mobile-large' },
    { width: 375, height: 667, name: 'mobile-medium' },
    { width: 320, height: 568, name: 'mobile-small' }
  ],

  // Evidence collection settings
  evidence: {
    screenshotPath: './evidence/screenshots/login/',
    videoPath: './evidence/videos/login/',
    traceEnabled: true,
    tracePath: './evidence/traces/login/'
  }
};

// Utility functions for test data
export const TestDataHelpers = {
  /**
   * Get random invalid credentials for testing
   */
  getRandomInvalidCredentials() {
    const invalid = LoginTestData.invalidCredentials;
    return invalid[Math.floor(Math.random() * invalid.length)];
  },

  /**
   * Get random security test case
   */
  getRandomSecurityTest() {
    const security = LoginTestData.securityTestCases;
    return security[Math.floor(Math.random() * security.length)];
  },

  /**
   * Generate test evidence filename
   */
  generateEvidenceFilename(testName, type = 'screenshot') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const extension = type === 'screenshot' ? 'png' : type === 'video' ? 'webm' : 'json';
    return `${testName}-${timestamp}.${extension}`;
  },

  /**
   * Validate test data structure
   */
  validateTestData(data) {
    const required = ['username', 'password', 'description'];
    for (const field of required) {
      if (!(field in data)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    return true;
  }
};
