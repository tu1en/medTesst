const XLSX = require('xlsx');
const fs = require('fs');

// Test case data structure
const testCases = [
  {
    'Test ID': 'TC001',
    'Test Name': 'Verify login page elements are present',
    'Module': 'Login',
    'Priority': 'High',
    'Test Type': 'UI',
    'Description': 'Verify that all login page elements (username, password, login button) are present and visible',
    'Pre-conditions': 'Navigate to login page',
    'Test Steps': '1. Open login page\n2. Verify username field is present\n3. Verify password field is present\n4. Verify login button is present',
    'Expected Result': 'All login elements should be visible and accessible',
    'Status': 'Not Executed',
    'Actual Result': '',
    'Comments': ''
  },
  {
    'Test ID': 'TC002',
    'Test Name': 'Valid login credentials',
    'Module': 'Login',
    'Priority': 'High',
    'Test Type': 'Functional',
    'Description': 'Test login with valid credentials (admin/1q2w3E*)',
    'Pre-conditions': 'Login page is loaded',
    'Test Steps': '1. Enter username: admin\n2. Enter password: 1q2w3E*\n3. Click login button',
    'Expected Result': 'User should be redirected to dashboard/main page',
    'Status': 'Not Executed',
    'Actual Result': '',
    'Comments': ''
  },
  {
    'Test ID': 'TC003',
    'Test Name': 'Invalid login credentials',
    'Module': 'Login',
    'Priority': 'High',
    'Test Type': 'Negative',
    'Description': 'Test login with various invalid credential combinations',
    'Pre-conditions': 'Login page is loaded',
    'Test Steps': '1. Try invalid username/password combinations\n2. Try empty fields\n3. Verify error handling',
    'Expected Result': 'Should show appropriate error messages and remain on login page',
    'Status': 'Not Executed',
    'Actual Result': '',
    'Comments': ''
  },
  {
    'Test ID': 'TC004',
    'Test Name': 'UI responsiveness test',
    'Module': 'Login',
    'Priority': 'Medium',
    'Test Type': 'UI',
    'Description': 'Test login page responsiveness on different screen sizes',
    'Pre-conditions': 'Login page is loaded',
    'Test Steps': '1. Test on desktop (1920x1080)\n2. Test on tablet (768x1024)\n3. Test on mobile (375x667)',
    'Expected Result': 'Login page should be responsive and usable on all screen sizes',
    'Status': 'Not Executed',
    'Actual Result': '',
    'Comments': ''
  },
  {
    'Test ID': 'TC005',
    'Test Name': 'Form validation test',
    'Module': 'Login',
    'Priority': 'Medium',
    'Test Type': 'Functional',
    'Description': 'Test form validation for required fields',
    'Pre-conditions': 'Login page is loaded',
    'Test Steps': '1. Submit empty form\n2. Submit with only username\n3. Submit with only password',
    'Expected Result': 'Form should validate required fields and show appropriate messages',
    'Status': 'Not Executed',
    'Actual Result': '',
    'Comments': ''
  }
];

// Create workbook and worksheet
const workbook = XLSX.utils.book_new();
const worksheet = XLSX.utils.json_to_sheet(testCases);

// Auto-size columns
const columnWidths = [
  { wch: 10 }, // Test ID
  { wch: 40 }, // Test Name
  { wch: 15 }, // Module
  { wch: 10 }, // Priority
  { wch: 15 }, // Test Type
  { wch: 60 }, // Description
  { wch: 30 }, // Pre-conditions
  { wch: 80 }, // Test Steps
  { wch: 60 }, // Expected Result
  { wch: 15 }, // Status
  { wch: 40 }, // Actual Result
  { wch: 30 }  // Comments
];

worksheet['!cols'] = columnWidths;

// Add worksheet to workbook
XLSX.utils.book_append_sheet(workbook, worksheet, 'Login Test Cases');

// Create test execution summary sheet
const executionSummary = [
  {
    'Module': 'Login',
    'Total Test Cases': testCases.length,
    'Passed': 0,
    'Failed': 0,
    'Not Executed': testCases.length,
    'Pass Rate': '0%',
    'Last Execution': new Date().toISOString().split('T')[0]
  }
];

const summarySheet = XLSX.utils.json_to_sheet(executionSummary);
XLSX.utils.book_append_sheet(workbook, summarySheet, 'Execution Summary');

// Save the file
XLSX.writeFile(workbook, './data/test-cases-login.xlsx');

console.log('Test case Excel file created: ./data/test-cases-login.xlsx');
