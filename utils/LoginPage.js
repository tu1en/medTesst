export class LoginPage {
  constructor(page) {
    this.page = page;
    
    // Login page elements
    this.usernameInput = 'input[name="username"], input[type="text"]';
    this.passwordInput = 'input[name="password"], input[type="password"]';
    this.loginButton = 'button[type="submit"], .login-btn, .btn-login';
    this.loginForm = 'form, .login-form';
    this.errorMessage = '.error, .alert-danger, .error-message';
    this.successMessage = '.success, .alert-success';
    
    // Page identifiers
    this.pageTitle = 'title';
    this.loginContainer = '.login-container, .login-box, .auth-container';
  }
  
  async navigate() {
    await this.page.goto('https://medlatec-portal-fe.vercel.app/login');
    await this.page.waitForLoadState('networkidle');
  }
  
  async login(username, password) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
    await this.page.waitForLoadState('networkidle');
  }
  
  async getErrorMessage() {
    try {
      return await this.page.textContent(this.errorMessage);
    } catch {
      return null;
    }
  }
  
  async isLoggedIn() {
    try {
      await this.page.waitForURL('**/dashboard', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
  
  async takeScreenshot(name) {
    await this.page.screenshot({ 
      path: `./evidence/screenshots/login-${name}.png`,
      fullPage: true 
    });
  }
}
