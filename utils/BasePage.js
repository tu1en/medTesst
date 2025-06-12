export class BasePage {
  constructor(page) {
    this.page = page;
    
    // Common navigation elements
    this.header = 'header, .header, .navbar';
    this.sidebar = '.sidebar, .side-nav, .navigation';
    this.mainContent = 'main, .main-content, .content';
    this.footer = 'footer, .footer';
    
    // Common buttons and actions
    this.saveButton = 'button:has-text("Save"), .btn-save, [data-action="save"]';
    this.cancelButton = 'button:has-text("Cancel"), .btn-cancel, [data-action="cancel"]';
    this.deleteButton = 'button:has-text("Delete"), .btn-delete, [data-action="delete"]';
    this.editButton = 'button:has-text("Edit"), .btn-edit, [data-action="edit"]';
    this.addButton = 'button:has-text("Add"), .btn-add, [data-action="add"]';
    
    // Common form elements
    this.submitButton = 'button[type="submit"], .btn-submit';
    this.resetButton = 'button[type="reset"], .btn-reset';
    
    // Common feedback elements
    this.successAlert = '.alert-success, .success, .notification-success';
    this.errorAlert = '.alert-error, .error, .notification-error';
    this.loadingSpinner = '.loading, .spinner, .loader';
  }
  
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }
  
  async takeScreenshot(name) {
    await this.page.screenshot({ 
      path: `./evidence/screenshots/${name}.png`,
      fullPage: true 
    });
  }
  
  async getPageTitle() {
    return await this.page.title();
  }
  
  async getCurrentUrl() {
    return this.page.url();
  }
  
  async getAlertMessage() {
    try {
      const success = await this.page.textContent(this.successAlert);
      if (success) return { type: 'success', message: success };
    } catch {}
    
    try {
      const error = await this.page.textContent(this.errorAlert);
      if (error) return { type: 'error', message: error };
    } catch {}
    
    return null;
  }
  
  async clickNavigation(menuText) {
    await this.page.click(`text="${menuText}"`);
    await this.waitForPageLoad();
  }
}
