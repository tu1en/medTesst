# 🎨 CMS Module Testing

## 📋 Tổng quan
Module testing cho **Content Management System (CMS)** của Medlatec Portal - kiểm thử tất cả chức năng quản lý nội dung, media, và workflow xuất bản.

## 🎯 Chức năng chính được test

### 📝 Content Management
- ✅ Tạo mới content (articles, pages, news)
- ✅ Chỉnh sửa content hiện có
- ✅ Xóa content và restore
- ✅ Content versioning và history
- ✅ Draft/Published status management

### 🖼️ Media Management  
- ✅ Upload images/documents
- ✅ Media library organization
- ✅ Image resizing và optimization
- ✅ Media metadata management
- ✅ Bulk media operations

### 📊 Content Publishing Workflow
- ✅ Draft → Review → Publish workflow
- ✅ Content approval process
- ✅ Scheduled publishing
- ✅ Content categories và tags
- ✅ SEO metadata management

### 👥 User Role & Permissions
- ✅ Editor role permissions
- ✅ Author role permissions  
- ✅ Admin content controls
- ✅ Content ownership rules
- ✅ Collaborative editing

## 📁 Cấu trúc Files

```
cms-module/
├── 📁 outlines/
│   ├── cms-content-management.outline.md    # Content CRUD operations
│   ├── cms-media-management.outline.md     # Media upload/management
│   ├── cms-publishing-workflow.outline.md  # Publishing process
│   └── cms-user-permissions.outline.md     # Role-based access
├── 📁 specs/
│   ├── cms.create-content.spec.js          # Content creation tests
│   ├── cms.edit-content.spec.js            # Content editing tests
│   ├── cms.delete-content.spec.js          # Content deletion tests
│   ├── cms.media-upload.spec.js            # Media management tests
│   ├── cms.publishing-workflow.spec.js     # Publishing process tests
│   ├── cms.content-categories.spec.js      # Category management
│   ├── cms.seo-metadata.spec.js           # SEO features tests
│   └── cms.user-permissions.spec.js        # Permission testing
└── 📁 components/
    ├── CMSContentPage.js                    # Content management page
    ├── CMSMediaPage.js                      # Media library page
    ├── CMSEditorPage.js                     # Content editor page
    ├── CMSPublishingPage.js                 # Publishing workflow page
    └── CMSSettingsPage.js                   # CMS settings page
```

## 🧪 Test Scenarios

### 📝 Content Management Tests

#### ✅ Successful Scenarios
- Tạo content với đầy đủ metadata
- Edit content và save changes
- Duplicate content templates
- Bulk content operations
- Content search và filtering

#### ❌ Error Scenarios  
- Tạo content thiếu required fields
- Edit content đã published
- Delete content có dependencies
- Invalid file uploads
- Permission denied scenarios

### 🖼️ Media Management Tests

#### ✅ File Upload Tests
- Upload images (JPG, PNG, WebP)
- Upload documents (PDF, DOC, XLS)
- Bulk file upload
- Drag & drop functionality
- File size validation

#### ❌ Upload Error Tests
- File size quá lớn
- Invalid file formats
- Duplicate file names
- Storage quota exceeded
- Network interruption during upload

### 📊 Publishing Workflow Tests

#### ✅ Workflow States
- Draft → Review transition
- Review → Published transition  
- Published → Archived transition
- Scheduled publishing
- Auto-save draft functionality

#### ❌ Workflow Errors
- Publish without required approvals
- Edit published content without permissions
- Schedule conflicts
- Workflow rule violations

## 🔐 Security & Permission Tests

### 👤 Role-Based Testing
- **Editor**: Can create/edit own content
- **Author**: Can create drafts only
- **Admin**: Full CMS access
- **Viewer**: Read-only access

### 🛡️ Security Validations
- SQL injection trong content fields
- XSS prevention trong HTML content
- File upload security (malicious files)
- CSRF protection trong forms
- Authentication boundaries

## 📊 Performance Tests

### ⚡ Load Testing
- Content list pagination performance
- Media library load times
- Large file upload performance
- Bulk operations scalability
- Search response times

### 📈 Metrics Tracking
- Page load times < 3 seconds
- File upload success rate > 95%
- Search results < 1 second
- Bulk operations progress tracking

## 🚀 Chạy CMS Tests

```bash
# Chạy tất cả CMS tests
npm run test:cms

# Chạy specific test files
npx playwright test tests/cms-module/specs/cms.create-content.spec.js

# Chạy CMS tests với evidence collection
npm run mcp:cms

# Debug CMS tests  
npx playwright test tests/cms-module/specs/ --debug

# Chạy CMS tests trên multiple browsers
npx playwright test tests/cms-module/specs/ --project=chromium,firefox,webkit
```

## 📋 Test Data

### 📝 Content Test Data
```javascript
// cms-test-data.js
export const contentTestData = {
  validContent: {
    title: "Test Article Title",
    content: "<p>Test article content...</p>",
    category: "News",
    tags: ["health", "medlatec"],
    status: "draft"
  },
  invalidContent: {
    title: "", // Empty title
    content: null,
    category: "InvalidCategory"
  }
};
```

### 🖼️ Media Test Data
```javascript
export const mediaTestData = {
  validImages: ["test-image.jpg", "test-banner.png"],
  invalidFiles: ["test-script.exe", "large-file.zip"],
  uploadLimits: {
    maxFileSize: "10MB",
    allowedFormats: ["jpg", "png", "gif", "pdf", "doc"]
  }
};
```

## ⚠️ Chú ý quan trọng

### 🚨 Test Environment
- **Staging environment**: Dùng để test CMS features
- **Test content**: Không ảnh hưởng production data
- **Cleanup**: Auto-cleanup test content sau mỗi test run
- **Permissions**: Test với multiple user roles

### 📸 Evidence Collection
- Screenshot của content editor interface
- Video recording của publishing workflow
- Network traces cho file uploads
- Console logs cho debugging

### 🔄 Test Maintenance
- Update tests khi CMS UI changes
- Refresh test data định kỳ
- Monitor test execution times
- Update page objects khi needed

## 📚 Tài liệu tham khảo

- [CMS User Guide](../../docs/cms-user-guide.md)
- [Content Publishing Workflow](../../docs/cms-workflow.md)
- [Media Management Best Practices](../../docs/media-management.md)
- [CMS Security Guidelines](../../docs/cms-security.md)

---
**🎨 Quality CMS Testing for Medlatec Portal**
