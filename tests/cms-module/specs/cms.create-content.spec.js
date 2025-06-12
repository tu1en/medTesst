const { test, expect } = require('@playwright/test');
const { CMSContentPage } = require('../components/CMSContentPage');

test.describe('CMS Content Creation', () => {
  let cmsPage;

  test.beforeEach(async ({ page }) => {
    cmsPage = new CMSContentPage(page);
    
    // Login as content editor
    await cmsPage.navigate('/cms/login');
    await cmsPage.loginAsEditor();
    
    // Navigate to content creation
    await cmsPage.navigateToContentCreation();
  });

  test('TC_CMS_01 - Create new medical article content', async ({ page }) => {
    // Step 1: Fill basic content information
    await cmsPage.enterContentTitle('Test Medical Article - Automated Test');
    await cmsPage.enterContentBody(`
      <h2>Medical Test Article</h2>
      <p>This is a test medical article created during automated testing.</p>
      <p>Content includes important medical information for testing purposes.</p>
    `);
    
    // Take screenshot after content entry
    await cmsPage.takeScreenshot('cms-content-basic-info-entered');
    
    // Step 2: Set content metadata
    await cmsPage.selectCategory('Medical Articles');
    await cmsPage.addTags(['health', 'medical', 'test']);
    await cmsPage.setAuthor('Test Editor');
    await cmsPage.setPublicationDate(new Date());
    
    // Step 3: Upload featured image
    const testImagePath = 'data/test-images/medical-test-image.jpg';
    await cmsPage.uploadFeaturedImage(testImagePath);
    
    // Verify image upload success
    await expect(page.locator('.featured-image-preview')).toBeVisible();
    
    // Step 4: Configure SEO metadata
    await cmsPage.setSEOTitle('Test Medical Article - Healthcare Information');
    await cmsPage.setSEODescription('Comprehensive medical article for testing automated CMS functionality');
    await cmsPage.setSEOKeywords('medical, healthcare, test, automation');
    
    // Take screenshot before saving
    await cmsPage.takeScreenshot('cms-content-ready-to-save');
    
    // Step 5: Save as draft
    await cmsPage.saveAsDraft();
    
    // Verify draft saved successfully
    await expect(page.locator('.status-indicator.draft')).toBeVisible();
    await expect(page.locator('.success-message')).toContainText('Content saved as draft');
    
    // Step 6: Verify draft appears in content list
    await cmsPage.navigateToContentList();
    await expect(page.locator('.content-item').first()).toContainText('Test Medical Article');
    
    // Take final screenshot
    await cmsPage.takeScreenshot('cms-content-draft-created');
  });

  test('TC_CMS_02 - Content validation and error handling', async ({ page }) => {
    // Test required field validation
    await cmsPage.clickSaveButton();
    
    // Verify validation errors appear
    await expect(page.locator('.error-message')).toContainText('Title is required');
    await expect(page.locator('.field-error.title')).toBeVisible();
    
    // Fill minimum required fields
    await cmsPage.enterContentTitle('Test Validation Article');
    
    // Try to save again
    await cmsPage.clickSaveButton();
    
    // Verify content body validation
    await expect(page.locator('.error-message')).toContainText('Content body is required');
    
    // Complete required fields và save successfully
    await cmsPage.enterContentBody('<p>Test content body for validation testing.</p>');
    await cmsPage.saveAsDraft();
    
    // Verify successful save
    await expect(page.locator('.success-message')).toBeVisible();
    
    await cmsPage.takeScreenshot('cms-validation-testing-complete');
  });

  test('TC_CMS_03 - Bulk media upload to content', async ({ page }) => {
    // Navigate to media section
    await cmsPage.openMediaSection();
    
    // Perform bulk upload
    const mediaFiles = [
      'data/test-images/medical-image-1.jpg',
      'data/test-images/medical-image-2.png', 
      'data/test-images/medical-diagram.jpg'
    ];
    
    await cmsPage.bulkUploadMedia(mediaFiles);
    
    // Verify upload progress
    await expect(page.locator('.upload-progress')).toBeVisible();
    
    // Wait for upload completion
    await cmsPage.waitForUploadCompletion();
    
    // Verify all files uploaded successfully
    for (const file of mediaFiles) {
      const fileName = file.split('/').pop();
      await expect(page.locator(`.media-item[data-filename="${fileName}"]`)).toBeVisible();
    }
    
    // Attach media to content
    await cmsPage.attachMediaToContent();
    
    // Verify media gallery in content
    await expect(page.locator('.content-media-gallery')).toBeVisible();
    await expect(page.locator('.media-thumbnail')).toHaveCount(3);
    
    await cmsPage.takeScreenshot('cms-bulk-media-upload-complete');
  });

  test('TC_CMS_04 - Content publishing workflow', async ({ page }) => {
    // Create content first
    await cmsPage.createBasicContent('Test Publishing Article');
    
    // Submit for review
    await cmsPage.submitForReview();
    
    // Verify status change
    await expect(page.locator('.status-indicator.under-review')).toBeVisible();
    await expect(page.locator('.status-text')).toContainText('Under Review');
    
    // Verify editor cannot edit submitted content
    await expect(page.locator('.edit-button')).toBeDisabled();
    
    // Simulate reviewer approval (in real scenario, would login as different user)
    await cmsPage.simulateReviewerApproval();
    
    // Verify approved status
    await expect(page.locator('.status-indicator.approved')).toBeVisible();
    
    // Schedule publishing
    const publishDate = new Date();
    publishDate.setMinutes(publishDate.getMinutes() + 5); // 5 minutes from now
    
    await cmsPage.schedulePublishing(publishDate);
    
    // Verify scheduled publishing
    await expect(page.locator('.scheduled-indicator')).toBeVisible();
    await expect(page.locator('.publish-time')).toContainText(publishDate.toLocaleString());
    
    // Publish immediately for testing
    await cmsPage.publishNow();
    
    // Verify published status
    await expect(page.locator('.status-indicator.published')).toBeVisible();
    await expect(page.locator('.live-url')).toBeVisible();
    
    await cmsPage.takeScreenshot('cms-publishing-workflow-complete');
  });

  test.afterEach(async ({ page }) => {
    // Cleanup: Delete test content
    await cmsPage.cleanupTestContent();
    
    // Take final state screenshot
    await cmsPage.takeScreenshot('cms-test-cleanup-complete');
  });
});

test.describe('CMS Error Scenarios', () => {
  let cmsPage;

  test.beforeEach(async ({ page }) => {
    cmsPage = new CMSContentPage(page);
    await cmsPage.navigate('/cms/login');
    await cmsPage.loginAsEditor();
  });

  test('TC_CMS_05 - File upload size limitations', async ({ page }) => {
    await cmsPage.navigateToContentCreation();
    
    // Attempt to upload oversized file
    const oversizedFile = 'data/test-files/large-medical-document.pdf'; // > 10MB
    
    await cmsPage.uploadFile(oversizedFile);
    
    // Verify error message
    await expect(page.locator('.upload-error')).toContainText('File size exceeds maximum limit');
    await expect(page.locator('.error-details')).toContainText('Maximum file size: 10MB');
    
    // Verify file not uploaded
    await expect(page.locator('.uploaded-file')).toHaveCount(0);
    
    await cmsPage.takeScreenshot('cms-file-size-limit-error');
  });

  test('TC_CMS_06 - Invalid file format handling', async ({ page }) => {
    await cmsPage.navigateToContentCreation();
    
    // Attempt to upload invalid file format
    const invalidFile = 'data/test-files/executable-file.exe';
    
    await cmsPage.uploadFile(invalidFile);
    
    // Verify error message
    await expect(page.locator('.upload-error')).toContainText('Invalid file format');
    await expect(page.locator('.allowed-formats')).toContainText('Allowed formats: jpg, png, pdf, doc');
    
    await cmsPage.takeScreenshot('cms-invalid-format-error');
  });
});
