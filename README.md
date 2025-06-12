# 🏥 Medlatec Portal Testing Framework

[![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=Playwright&logoColor=white)](https://playwright.dev/)
[![MCP](https://img.shields.io/badge/MCP-Protocol-blue?style=for-the-badge)](https://modelcontextprotocol.io/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

## 📋 Tổng quan dự án

**Medlatec Portal Testing Framework** là một hệ thống testing tự động hóa hoàn chỉnh cho cổng thông tin quản trị Medlatec, sử dụng **Playwright** và **MCP (Model Context Protocol)** để thực hiện testing toàn diện với khả năng thu thập bằng chứng tự động.

### 🎯 Mục tiêu
- **Testing tự động**: Kiểm thử tất cả chức năng của portal Medlatec
- **Thu thập bằng chứng**: Screenshots, videos, traces tự động
- **Báo cáo chi tiết**: HTML, JSON, JUnit reports
- **Chuẩn MCP**: Theo chuẩn Model Context Protocol
- **Scalable**: Dễ mở rộng và bảo trì

## 🚀 Quick Start

### Yêu cầu hệ thống
- **Node.js** >= 16.0.0
- **npm** >= 8.0.0
- **Windows 10/11** (khuyến nghị)

### Cài đặt nhanh

```bash
# 1. Clone repository
git clone https://github.com/your-username/medlatec-portal-testing.git
cd medlatec-portal-testing

# 2. Cài đặt dependencies
npm install

# 3. Cài đặt Playwright browsers
npx playwright install

# 4. Chạy test đầu tiên
npm run test:login
```

### Chạy test nhanh

```bash
# Chạy tất cả tests với MCP
npm run mcp

# Chạy test module cụ thể
npm run test:cms          # CMS Module
npm run test:partner      # Partner Module  
npm run test:coll         # Collection Module
npm run test:login        # Login functionality
npm run test:patient      # Patient management

# Chạy test với giao diện
npm run test:ui

# Chạy test debug
npm run test:debug
```

## 📁 Cấu trúc dự án

```
medlatec-portal-testing/
├── 📁 tests/                    # Tất cả test cases
│   ├── 📁 cms-module/          # CMS Management Tests
│   ├── 📁 partner-module/      # Partner Management Tests  
│   ├── 📁 collection-module/   # Collection Management Tests
│   ├── 📁 login-functionality/ # Authentication Tests
│   ├── 📁 patient-management/  # Patient Management Tests
│   └── 📁 utils/              # Utilities & Helpers
├── 📁 playwright-mcp/          # MCP Framework Core
├── 📁 scripts/                 # Test runners & utilities
├── 📁 evidence/               # Test evidence collection
├── 📁 reports/                # Test reports output
├── 📁 config/                 # Configuration files
└── 📋 README.md               # This file
```

## 🧪 Test Modules

### 🔐 Login Functionality (`tests/login-functionality/`)
- ✅ Successful login scenarios
- ❌ Invalid credentials handling
- 🔒 Security boundary testing
- ⌨️ Keyboard navigation testing

### 🏥 CMS Module (`tests/cms-module/`)
- 📝 Content management
- 📊 Content publishing workflow
- 🖼️ Media management
- 👥 User role permissions

### 🤝 Partner Module (`tests/partner-module/`)
- 👨‍💼 Partner registration
- 📋 Partner profile management
- 💼 Contract management
- 📈 Partner reporting

### 📚 Collection Module (`tests/collection-module/`)
- 📋 Data collection workflows
- 📊 Collection reporting
- 🔍 Search and filtering
- 📤 Export functionality

### 👥 Patient Management (`tests/patient-management/`)
- 👤 Patient registration
- 🔍 Patient search & listing
- 📝 Medical records management
- 📅 Appointment scheduling

## 🛠️ Scripts có sẵn

| Script | Mô tả | Sử dụng |
|--------|-------|---------|
| `npm run mcp` | Chạy tất cả tests theo MCP | Production testing |
| `npm run test:cms` | Test CMS module | Module testing |
| `npm run test:partner` | Test Partner module | Module testing |
| `npm run test:coll` | Test Collection module | Module testing |
| `npm run test:ui` | Chạy test với UI | Development |
| `npm run test:debug` | Debug mode | Troubleshooting |
| `npm run test:headed` | Chạy test có giao diện | Visual testing |
| `npm run report` | Tạo báo cáo HTML | Reporting |

## 📊 Evidence Collection

Framework tự động thu thập:
- 📸 **Screenshots**: Mỗi bước test quan trọng
- 🎥 **Videos**: Toàn bộ quá trình test
- 🔍 **Traces**: Debug traces cho phân tích
- 📋 **Logs**: Console logs và network requests
- 📄 **Reports**: HTML, JSON, JUnit formats

Vị trí lưu trữ:
```
evidence/
├── screenshots/     # Ảnh chụp màn hình
├── videos/         # Video recording
├── traces/         # Playwright traces
└── logs/          # Test execution logs
```

## ⚙️ Configuration

### Playwright Config (`playwright.config.ts`)
```javascript
export default defineConfig({
  testDir: './tests',
  baseURL: 'https://medlatec-portal-fe.vercel.app',
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'webkit', use: devices['Desktop Safari'] },
  ],
});
```

### MCP Config (`config/mcp-config.json`)
- Browser settings
- Evidence collection settings
- Reporting preferences
- Module-specific configurations

## 🔧 Development

### Thêm test mới

1. **Tạo test outline**:
```bash
# Tạo file outline cho business flow
touch tests/[module-name]/outlines/[flow-name].outline.md
```

2. **Tạo test specs**:
```bash
# Tạo test specification 
touch tests/[module-name]/specs/[test-case].spec.js
```

3. **Tạo components (nếu cần)**:
```bash
# Tạo Page Object Models
touch tests/[module-name]/components/[PageName].js
```

### Best Practices

- ✅ **Mỗi test file ≤ 200 LOC**
- ✅ **Sử dụng Page Object Model**
- ✅ **Meaningful test descriptions**
- ✅ **Evidence collection tại các bước quan trọng**
- ✅ **Error handling robust**

## 🚨 Troubleshooting

### Lỗi thường gặp

**1. Browser không khởi động được**
```bash
# Cài đặt lại browsers
npx playwright install --force
```

**2. Test timeout**
```bash
# Tăng timeout trong config
# playwright.config.ts -> timeout: 60000
```

**3. Element không tìm thấy**
```bash
# Chạy debug mode để xem UI
npm run test:debug
```

## 📚 Tài liệu tham khảo

- [Playwright Documentation](https://playwright.dev/)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [Test Writing Guidelines](./docs/test-writing-guide.md)
- [Architecture Overview](./docs/architecture.md)

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/new-test-module`
3. Commit changes: `git commit -am 'Add new test module'`
4. Push branch: `git push origin feature/new-test-module`
5. Tạo Pull Request

## 📝 License

MIT License - xem [LICENSE](LICENSE) file

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/medlatec-portal-testing/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/medlatec-portal-testing/discussions)
- **Email**: support@medlatec-testing.com

---

**🎯 Made with ❤️ for Medlatec Portal Quality Assurance**
"# medlatec-testing-framework" 
"# medTesst" 
"# medTesst" 
