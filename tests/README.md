# 📁 Tests Directory

## 🎯 Mục đích
Thư mục chứa tất cả các test cases được tổ chức theo modules và chức năng của Medlatec Portal.

## 📋 Cấu trúc tổ chức

```
tests/
├── 📁 cms-module/           # Content Management System Tests
├── 📁 partner-module/       # Partner Management Tests  
├── 📁 collection-module/    # Collection/Data Management Tests
├── 📁 login-functionality/  # Authentication & Login Tests
├── 📁 patient-management/   # Patient Management Tests
├── 📁 appointment-management/ # Appointment Scheduling Tests
├── 📁 reports-functionality/  # Reporting & Analytics Tests
├── 📁 settings-functionality/ # System Settings Tests
├── 📁 dashboard-functionality/ # Dashboard Tests
├── 📁 user-management/      # User & Role Management Tests
└── 📁 utils/               # Shared utilities & helpers
```

## 🏗️ Chuẩn cấu trúc mỗi module

Mỗi module test phải tuân theo cấu trúc sau:

```
[module-name]/
├── 📁 outlines/            # Program outlines (.md files)
│   ├── [flow-name].outline.md
│   └── ...
├── 📁 specs/              # Test specifications (.spec.js files)
│   ├── [test-case].spec.js
│   └── ...
└── 📁 components/         # Page Object Models & helpers
    ├── [PageName].js
    └── ...
```

## 📏 Quy tắc đặt tên

### Outline Files
- **Format**: `[business-flow].outline.md`
- **Examples**: 
  - `login.outline.md`
  - `patient-creation.outline.md`
  - `cms-content-management.outline.md`

### Spec Files
- **Format**: `[test-case-description].spec.js`
- **Examples**:
  - `login.successful.spec.js`
  - `login.invalid-credentials.spec.js`
  - `cms.create-content.spec.js`

### Component Files
- **Format**: `[ComponentName].js` (PascalCase)
- **Examples**:
  - `LoginPage.js`
  - `CMSContentPage.js`
  - `PatientFormPage.js`

## 🧪 Loại tests

### 1. **Functional Testing**
- Business logic validation
- User workflow testing
- Data integrity checks

### 2. **UI/UX Testing**
- Interface responsiveness
- Element visibility
- User interaction flows

### 3. **Integration Testing**
- API integration
- Database connectivity
- Third-party services

### 4. **Security Testing**
- Authentication boundaries
- Authorization checks
- Input validation

### 5. **Performance Testing**
- Page load times
- Search performance
- Bulk operations

## ⚡ Test Execution Priority

Tests được thực thi theo thứ tự ưu tiên:

1. **Priority 1**: `login-functionality/` (Authentication base)
2. **Priority 2**: `dashboard-functionality/` (Main interface)
3. **Priority 3**: `cms-module/` (Content management)
4. **Priority 4**: `partner-module/` (Partner management)
5. **Priority 5**: `collection-module/` (Data collection)
6. **Priority 6**: `patient-management/` (Patient data)
7. **Priority 7**: `user-management/` (User administration)
8. **Priority 8**: `appointment-management/` (Scheduling)
9. **Priority 9**: `reports-functionality/` (Analytics)
10. **Priority 10**: `settings-functionality/` (System config)

## 🛠️ Best Practices

### ✅ DO's
- **Mỗi spec file ≤ 200 LOC**
- **Sử dụng Page Object Model**
- **Meaningful test descriptions**
- **Robust error handling**
- **Evidence collection tại steps quan trọng**
- **Clear assertions với expected outcomes**

### ❌ DON'Ts
- **Không hard-code data trong specs**
- **Không skip test cleanup**
- **Không ignore error handling**
- **Không duplicate test logic**

## 📊 Evidence Collection

Mỗi test tự động thu thập:
- 📸 Screenshots tại key steps
- 🎥 Video recording toàn bộ test
- 🔍 Playwright traces cho debugging
- 📋 Console logs và network requests

## 🚀 Chạy Tests

```bash
# Chạy tất cả tests
npm run test

# Chạy specific module
npm run test:cms
npm run test:partner  
npm run test:collection

# Chạy với MCP protocol
npm run mcp

# Debug mode
npm run test:debug
```

## 📝 Thêm Test Mới

1. **Tạo outline file** trong `outlines/`
2. **Develop test specs** trong `specs/`
3. **Create page objects** trong `components/` (nếu cần)
4. **Update test runner** để include module mới
5. **Run và validate** test cases

## 🔧 Configuration

Test configuration được quản lý trong:
- `playwright.config.ts` - Playwright settings
- `package.json` - NPM scripts
- `config/` - Module-specific configs

## 📚 Documentation

- [Test Writing Guide](../docs/test-writing-guide.md)
- [Page Object Model Pattern](../docs/pom-pattern.md)
- [Evidence Collection Guide](../docs/evidence-collection.md)

---
**🧪 Testing Excellence for Medlatec Portal**
