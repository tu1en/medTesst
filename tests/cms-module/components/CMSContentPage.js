class CMSContentPage {
  constructor(page) {
    this.page = page;
    this.baseURL = 'https://medlatec-portal-fe.vercel.app';
    
    // Selectors for CMS elements
    this.selectors = {
      // Login elements
      loginForm: '.cms-login-form',
      usernameField: 'input[name="username"]',
      passwordField: 'input[name="password"]',
      loginButton: '.login-submit-btn',
      
      // Navigation elements
      cmsNavigation: '.cms-navigation',
      contentMenuItem: '.nav-item.content',
      createContentButton: '.create-content-btn',
      contentListLink: '.content-list-link',
      
      // Content creation form
      contentForm: '.content-creation-form',
      titleField: 'input[name="title"]',
      contentEditor: '.content-editor .editor-content',
      categoryDropdown: 'select[name="category"]',
      tagsInput: 'input[name="tags"]',
      authorField: 'input[name="author"]',
      publicationDateField: 'input[name="publication_date"]',
      
      // Media elements
      featuredImageUpload: 'input[type="file"][name="featured_image"]',
      mediaSection: '.media-section',
      bulkUploadArea: '.bulk-upload-area',
      uploadProgress: '.upload-progress',
      mediaGallery: '.media-gallery',
      
      // SEO elements
      seoSection: '.seo-section',
      seoTitle: 'input[name="seo_title"]',
      seoDescription: 'textarea[name="seo_description"]',
      seoKeywords: 'input[name="seo_keywords"]',
      
      // Action buttons
      saveButton: '.save-button',
      saveDraftButton: '.save-draft-button',
      submitReviewButton: '.submit-review-button',
      publishButton: '.publish-button',
      
      // Status indicators
      statusIndicator: '.status-indicator',
      successMessage: '.success-message',
      errorMessage: '.error-message',
      
      // Content list
      contentList: '.content-list',
      contentItem: '.content-item'
    };
  }

  async navigate(path = '/cms') {
    await this.page.goto(`${this.baseURL}${path}`);
    await this.page.waitForLoadState('networkidle');
  }

  async loginAsEditor() {
    // Use CMS editor credentials
    await this.page.fill(this.selectors.usernameField, 'cms_editor');
    await this.page.fill(this.selectors.passwordField, 'cms123!@#');
    await this.page.click(this.selectors.loginButton);
    
    // Wait for dashboard to load
    await this.page.waitForSelector(this.selectors.cmsNavigation);
    await this.takeScreenshot('cms-editor-login-success');
  }

  async navigateToContentCreation() {
    await this.page.click(this.selectors.contentMenuItem);
    await this.page.click(this.selectors.createContentButton);
    
    // Wait for content form to load
    await this.page.waitForSelector(this.selectors.contentForm);
    await this.takeScreenshot('cms-content-creation-page');
  }

  async enterContentTitle(title) {
    await this.page.fill(this.selectors.titleField, title);
    
    // Verify title entered
    const enteredTitle = await this.page.inputValue(this.selectors.titleField);
    if (enteredTitle !== title) {
      throw new Error(`Title not entered correctly. Expected: ${title}, Got: ${enteredTitle}`);
    }
  }

  async enterContentBody(content) {
    // Handle rich text editor
    await this.page.click(this.selectors.contentEditor);
    
    // If using a rich text editor, might need special handling
    const editorFrame = this.page.frameLocator('.editor-frame');
    if (await editorFrame.locator('body').isVisible()) {
      await editorFrame.locator('body').fill(content);
    } else {
      // Fallback to direct input
      await this.page.fill(this.selectors.contentEditor, content);
    }
  }

  async selectCategory(category) {
    await this.page.selectOption(this.selectors.categoryDropdown, category);
  }

  async addTags(tags) {
    const tagsString = tags.join(', ');
    await this.page.fill(this.selectors.tagsInput, tagsString);
  }

  async setAuthor(author) {
    await this.page.fill(this.selectors.authorField, author);
  }

  async setPublicationDate(date) {
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    await this.page.fill(this.selectors.publicationDateField, dateString);
  }

  async uploadFeaturedImage(imagePath) {
    // Handle file upload
    await this.page.setInputFiles(this.selectors.featuredImageUpload, imagePath);
    
    // Wait for upload to complete
    await this.page.waitForSelector('.featured-image-preview', { timeout: 10000 });
    await this.takeScreenshot('cms-featured-image-uploaded');
  }

  async setSEOTitle(title) {
    await this.page.fill(this.selectors.seoTitle, title);
  }

  async setSEODescription(description) {
    await this.page.fill(this.selectors.seoDescription, description);
  }

  async setSEOKeywords(keywords) {
    await this.page.fill(this.selectors.seoKeywords, keywords);
  }

  async saveAsDraft() {
    await this.page.click(this.selectors.saveDraftButton);
    
    // Wait for save confirmation
    await this.page.waitForSelector(this.selectors.successMessage, { timeout: 5000 });
    await this.takeScreenshot('cms-content-saved-as-draft');
  }

  async navigateToContentList() {
    await this.page.click(this.selectors.contentListLink);
    await this.page.waitForSelector(this.selectors.contentList);
  }

  async clickSaveButton() {
    await this.page.click(this.selectors.saveButton);
    await this.page.waitForTimeout(1000); // Wait for validation
  }

  async openMediaSection() {
    await this.page.click(this.selectors.mediaSection);
    await this.page.waitForSelector(this.selectors.bulkUploadArea);
  }

  async bulkUploadMedia(filePaths) {
    await this.page.setInputFiles(this.selectors.bulkUploadArea + ' input[type="file"]', filePaths);
    await this.takeScreenshot('cms-bulk-upload-initiated');
  }

  async waitForUploadCompletion() {
    // Wait for upload progress to complete
    await this.page.waitForFunction(() => {
      const progress = document.querySelector('.upload-progress');
      return progress && progress.getAttribute('data-progress') === '100';
    }, { timeout: 30000 });
  }

  async attachMediaToContent() {
    const mediaItems = await this.page.locator('.media-item').count();
    
    for (let i = 0; i < mediaItems; i++) {
      await this.page.click(`.media-item:nth-child(${i + 1}) .attach-button`);
    }
    
    await this.takeScreenshot('cms-media-attached-to-content');
  }

  async createBasicContent(title) {
    await this.enterContentTitle(title);
    await this.enterContentBody(`<p>Test content for ${title}</p>`);
    await this.selectCategory('General');
    await this.saveAsDraft();
  }

  async submitForReview() {
    await this.page.click(this.selectors.submitReviewButton);
    await this.page.waitForSelector('.status-indicator.under-review');
    await this.takeScreenshot('cms-content-submitted-for-review');
  }

  async simulateReviewerApproval() {
    // This would normally require a different user login
    // For testing purposes, simulate the approval
    await this.page.evaluate(() => {
      // Simulate backend approval
      window.simulateApproval();
    });
    
    await this.page.waitForSelector('.status-indicator.approved');
  }

  async schedulePublishing(date) {
    await this.page.click('.schedule-publishing-button');
    
    const dateTimeString = date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
    await this.page.fill('input[name="scheduled_date"]', dateTimeString);
    
    await this.page.click('.confirm-schedule-button');
    await this.takeScreenshot('cms-publishing-scheduled');
  }

  async publishNow() {
    await this.page.click(this.selectors.publishButton);
    await this.page.waitForSelector('.status-indicator.published');
    await this.takeScreenshot('cms-content-published');
  }

  async uploadFile(filePath) {
    const fileInput = this.page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(filePath);
    
    // Wait for upload attempt
    await this.page.waitForTimeout(2000);
  }

  async cleanupTestContent() {
    // Navigate to content list
    await this.navigateToContentList();
    
    // Find and delete test content
    const testContent = this.page.locator('.content-item:has-text("Test")');
    const count = await testContent.count();
    
    for (let i = 0; i < count; i++) {
      await testContent.first().locator('.delete-button').click();
      await this.page.click('.confirm-delete-button');
      await this.page.waitForTimeout(1000);
    }
  }

  async takeScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const screenshotPath = `evidence/screenshots/cms/${name}-${timestamp}.png`;
    
    await this.page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    
    console.log(`📸 Screenshot saved: ${screenshotPath}`);
  }

  // Utility methods for element interaction
  async waitForElement(selector, timeout = 5000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  async isElementVisible(selector) {
    return await this.page.isVisible(selector);
  }

  async getElementText(selector) {
    return await this.page.textContent(selector);
  }

  async getElementCount(selector) {
    return await this.page.locator(selector).count();
  }
}

module.exports = { CMSContentPage };
