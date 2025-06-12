# Login Functionality Test - Invalid Credentials Program Outline

## Test Objective
Test the login functionality with invalid credentials to verify proper error handling and security measures.

## Test Steps Logic Framework

### Step 1: Initial Setup and Navigation
- **Input**: Empty browser state
- **Action**: Navigate to https://medlatec-portal-fe.vercel.app/login
- **Expected Output**: Login page loaded successfully
- **Next Step Input**: Login page is accessible and ready for testing

### Step 2: Page Elements Verification
- **Input**: Login page loaded
- **Action**: Verify presence of username field, password field, login button, and error message container
- **Expected Output**: All required elements are present and accessible
- **Next Step Input**: Form elements are ready for invalid credential testing

### Step 3: Invalid Username Test
- **Input**: Empty form state
- **Action**: Enter invalid username "invaliduser" and valid password "1q2w3E*"
- **Expected Output**: Form accepts input without client-side validation errors
- **Next Step Input**: Invalid credentials are entered

### Step 4: Submit Invalid Username Credentials
- **Input**: Invalid username and valid password entered
- **Action**: Click login button to submit form
- **Expected Output**: Form submission occurs, server processes request
- **Next Step Input**: Server response received

### Step 5: Verify Error Message for Invalid Username
- **Input**: Server response to invalid username
- **Action**: Check for appropriate error message display
- **Expected Output**: Error message appears indicating invalid credentials
- **Next Step Input**: Error state is properly displayed

### Step 6: Invalid Password Test
- **Input**: Form reset to empty state
- **Action**: Enter valid username "admin" and invalid password "wrongpass"
- **Expected Output**: Form accepts input
- **Next Step Input**: Valid username with invalid password entered

### Step 7: Submit Invalid Password Credentials
- **Input**: Valid username and invalid password entered
- **Action**: Click login button to submit form
- **Expected Output**: Form submission and server processing
- **Next Step Input**: Server response to invalid password

### Step 8: Verify Error Message for Invalid Password
- **Input**: Server response to invalid password
- **Action**: Check for appropriate error message display
- **Expected Output**: Error message appears, user remains on login page
- **Next Step Input**: Error handling verified

### Step 9: Empty Fields Test
- **Input**: Form reset to empty state
- **Action**: Attempt to submit form with empty username and password fields
- **Expected Output**: Client-side or server-side validation prevents submission or shows error
- **Next Step Input**: Empty field validation tested

### Step 10: SQL Injection Test
- **Input**: Form in ready state
- **Action**: Enter SQL injection attempt in username field: "' OR '1'='1"
- **Expected Output**: System properly sanitizes input and rejects login
- **Next Step Input**: Security validation tested

### Step 11: Evidence Collection
- **Input**: All test scenarios completed
- **Action**: Capture screenshots of each error state and compile results
- **Expected Output**: Comprehensive evidence of error handling behavior
- **Next Step Input**: Test documentation complete

## Error Handling Logic
- Each invalid attempt should display appropriate error messages
- System should not provide specific information about which field is incorrect
- No system errors or crashes should occur
- User should remain on login page after failed attempts

## Security Considerations
- Test for SQL injection vulnerability
- Verify no sensitive error information is exposed
- Check that failed attempts are properly logged (if applicable)
- Ensure proper rate limiting (if implemented)

## Success Criteria
1. Invalid credentials are properly rejected
2. Appropriate error messages are displayed
3. No system crashes or unexpected behavior
4. Security measures are functioning
5. User experience remains consistent
6. Form maintains functionality after errors
