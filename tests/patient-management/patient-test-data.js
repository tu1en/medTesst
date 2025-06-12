// Patient Management Test Data
// This file contains test data for patient management functionality

export const PatientTestData = {
  // Valid patient data sets
  validPatients: [
    {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-15',
      gender: 'Male',
      phone: '+1234567890',
      email: 'john.doe@example.com',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      bloodType: 'O+',
      allergies: 'Penicillin',
      emergencyContact: 'Jane Doe - +1234567891'
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: '1985-03-22',
      gender: 'Female',
      phone: '+1987654321',
      email: 'jane.smith@example.com',
      street: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
      bloodType: 'A+',
      allergies: 'None',
      emergencyContact: 'John Smith - +1987654322'
    },
    {
      firstName: 'Michael',
      lastName: 'Johnson',
      dateOfBirth: '1975-07-10',
      gender: 'Male',
      phone: '+1555123456',
      email: 'michael.johnson@example.com',
      street: '789 Pine Street',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
      bloodType: 'B-',
      allergies: 'Shellfish, Peanuts',
      emergencyContact: 'Sarah Johnson - +1555123457'
    }
  ],

  // Invalid data for validation testing
  invalidData: {
    emails: [
      'invalid-email',
      '@example.com',
      'test@',
      'test..test@example.com',
      ''
    ],
    phones: [
      '123',
      'abc123',
      '+++1234567890',
      '12345678901234567890',
      ''
    ],
    dates: [
      '2025-01-01', // Future date
      '1800-01-01', // Too old
      'invalid-date',
      '2023-13-32', // Invalid month/day
      ''
    ],
    names: [
      '', // Empty
      'A', // Too short
      'A'.repeat(101), // Too long (assuming 100 char limit)
      '123456', // Numbers only
      '<script>alert("xss")</script>' // XSS attempt
    ]
  },

  // Search test data
  searchTerms: {
    validSearches: [
      'John',
      'Doe',
      'john.doe@example.com',
      '+1234567890',
      'New York'
    ],
    partialMatches: [
      'Jo',
      'Smith',
      '@example.com'
    ],
    noResults: [
      'nonexistentpatient12345',
      'zzzzzzzzz',
      'invaliddata999'
    ],
    specialCharacters: [
      'O\'Connor',
      'José',
      'Smith-Johnson',
      'Van Der Berg'
    ]
  },

  // Filter test data
  filterOptions: {
    gender: ['Male', 'Female', 'Other'],
    bloodType: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    ageRanges: [
      { min: 0, max: 18, label: '0-18' },
      { min: 19, max: 35, label: '19-35' },
      { min: 36, max: 55, label: '36-55' },
      { min: 56, max: 100, label: '56+' }
    ]
  },

  // Performance test data
  performanceData: {
    bulkPatients: [], // Will be populated dynamically
    searchResponseTime: 2000, // Expected max response time in ms
    pageLoadTime: 3000,
    filterApplyTime: 1500
  },

  // Security test data
  securityTests: {
    sqlInjection: [
      "'; DROP TABLE patients; --",
      "' OR '1'='1",
      "'; INSERT INTO patients VALUES ('hacker'); --",
      "' UNION SELECT * FROM users --"
    ],
    xssAttempts: [
      '<script>alert("XSS")</script>',
      'javascript:alert("XSS")',
      '<img src="x" onerror="alert(\'XSS\')" />',
      '<svg onload="alert(\'XSS\')" />'
    ],
    htmlInjection: [
      '<h1>Injected HTML</h1>',
      '<iframe src="http://malicious.com"></iframe>',
      '<form action="http://attacker.com"><input type="submit"></form>'
    ]
  },

  // Edge cases
  edgeCases: {
    extremeAges: [
      { dateOfBirth: '1920-01-01', description: 'Very old patient' },
      { dateOfBirth: new Date().toISOString().split('T')[0], description: 'Born today' }
    ],
    longText: {
      firstName: 'A'.repeat(50),
      lastName: 'B'.repeat(50),
      allergies: 'Very long allergy list that exceeds normal length expectations and should test the system limits for text field handling and display capabilities in the user interface.',
      emergencyContact: 'Emergency contact with very long name and multiple phone numbers and addresses that should test field length limits'
    },
    specialCharacters: {
      firstName: 'José María',
      lastName: 'O\'Connor-Smith',
      street: '123 Straße, Apt. #5B',
      city: 'São Paulo'
    },
    unicodeCharacters: {
      firstName: '王小明',
      lastName: 'Müller',
      street: '١٢٣ شارع النيل',
      city: 'Москва'
    }
  },

  // Pagination test data
  paginationSettings: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
    maxPatientsForTest: 150 // For testing pagination
  },

  // Form validation messages
  expectedValidationMessages: {
    requiredFields: {
      firstName: 'First name is required',
      lastName: 'Last name is required',
      dateOfBirth: 'Date of birth is required',
      phone: 'Phone number is required',
      email: 'Email address is required'
    },
    formatValidation: {
      email: 'Please enter a valid email address',
      phone: 'Please enter a valid phone number',
      dateOfBirth: 'Please enter a valid date'
    },
    lengthValidation: {
      firstName: 'First name must be between 2 and 50 characters',
      lastName: 'Last name must be between 2 and 50 characters'
    }
  }
};

// Generate bulk test data for performance testing
export function generateBulkPatientData(count = 100) {
  const bulkData = [];
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'William', 'Jennifer'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['Male', 'Female'];

  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const bloodType = bloodTypes[Math.floor(Math.random() * bloodTypes.length)];
    
    // Generate random birth date between 1950 and 2005
    const birthYear = 1950 + Math.floor(Math.random() * 55);
    const birthMonth = 1 + Math.floor(Math.random() * 12);
    const birthDay = 1 + Math.floor(Math.random() * 28);
    
    bulkData.push({
      firstName: `${firstName}${i}`,
      lastName: `${lastName}${i}`,
      dateOfBirth: `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`,
      gender: gender,
      phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      email: `${firstName.toLowerCase()}${i}.${lastName.toLowerCase()}@example.com`,
      street: `${100 + i} Test Street`,
      city: 'Test City',
      state: 'TS',
      zipCode: `${10000 + i}`,
      country: 'USA',
      bloodType: bloodType,
      allergies: i % 3 === 0 ? 'None' : 'Test Allergy',
      emergencyContact: `Emergency Contact ${i} - +1${Math.floor(Math.random() * 9000000000) + 1000000000}`
    });
  }
  
  return bulkData;
}

// Utility function to get random patient data
export function getRandomPatientData() {
  const patients = PatientTestData.validPatients;
  return patients[Math.floor(Math.random() * patients.length)];
}

// Utility function to get patient data by index
export function getPatientDataByIndex(index) {
  const patients = PatientTestData.validPatients;
  return patients[index % patients.length];
}
