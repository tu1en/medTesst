# Login Functionality Test - Successful Login Program Outline

## Test Objective
Test the successful login functionality of the Medlatec admin website with valid credentials.

## Test Steps Logic Framework

### Step 1: Initial Setup and Navigation
- **Input**: Empty browser state
- **Action**: Navigate to https://medlatec-portal-fe.vercel.app/login
- **Expected Output**: Login page loaded with username field, password field, and login button visible
- **Next Step Input**: Login page elements are accessible

### Step 2: Page Element Identification
- **Input**: Login page loaded
- **Action**: Locate and identify key elements (username input, password input, login button)
- **Expected Output**: All login form elements are found and accessible
- **Next Step Input**: Form elements are ready for interaction

### Step 3: Credential Input - Username
- **Input**: Username field is accessible
- **Action**: Enter "admin" into the username field
- **Expected Output**: Username field contains "admin" text
- **Next Step Input**: Username field populated, ready for password input

### Step 4: Credential Input - Password
- **Input**: Password field is accessible and username is filled
- **Action**: Enter "1q2w3E*" into the password field
- **Expected Output**: Password field contains the masked password
- **Next Step Input**: Both username and password fields are populated

### Step 5: Login Submission
- **Input**: Both credentials are entered correctly
- **Action**: Click the login button
- **Expected Output**: Form submission initiated, page navigation begins
- **Next Step Input**: Navigation in progress

### Step 6: Navigation Verification
- **Input**: Login form submitted
- **Action**: Wait for page navigation and verify successful login
- **Expected Output**: User is redirected to dashboard/main page, URL changes from /login
- **Next Step Input**: User is successfully logged in

### Step 7: Dashboard Verification
- **Input**: User logged in and on main page
- **Action**: Verify dashboard elements are visible and accessible
- **Expected Output**: Dashboard content is loaded and user session is established
- **Next Step Input**: Test completion state

### Step 8: Evidence Collection
- **Input**: All previous steps completed successfully
- **Action**: Take screenshots and collect evidence of successful login
- **Expected Output**: Evidence files saved for test verification
- **Next Step Input**: Test completed with evidence

## Error Handling Logic
- If any step fails, capture screenshot of current state
- Log error details for debugging
- Ensure browser cleanup regardless of test outcome

## Success Criteria
1. Navigation to login page successful
2. Form elements are accessible and functional
3. Credentials can be entered without errors
4. Login submission works correctly
5. User is redirected to authenticated area
6. Dashboard content is accessible after login
7. No error messages appear during the process
8. Evidence is properly collected

## Test Data Requirements
- Valid username: "admin"
- Valid password: "1q2w3E*"
- Expected redirect URL pattern: Not containing "/login"

## Dependencies
- Website must be accessible
- Valid test credentials must work
- Browser automation tools must be functional
