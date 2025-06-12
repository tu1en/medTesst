# 📸 Evidence Directory

## 📋 Tổng quan
Thư mục chứa tất cả các bằng chứng (evidence) được thu thập tự động trong quá trình thực hiện testing theo chuẩn MCP approach.

## 🎯 Mục đích Evidence Collection

### 🔍 Debugging & Analysis
- **Screenshots**: Capture state tại mỗi step quan trọng
- **Videos**: Record toàn bộ test execution process
- **Traces**: Playwright debug traces cho detailed analysis
- **Logs**: Console messages và network requests

### 📊 Test Documentation
- **Visual Proof**: Bằng chứng hình ảnh về test execution
- **Step-by-step Evidence**: Proof của từng bước trong test flow
- **Error Documentation**: Screenshots của lỗi khi xảy ra
- **Performance Metrics**: Timing và performance data

### 🏥 Compliance & Quality Assurance
- **Audit Trail**: Complete execution history
- **Regulatory Compliance**: Evidence cho healthcare standards
- **Quality Control**: Proof of testing thoroughness
- **Stakeholder Communication**: Visual reports for management

## 📁 Cấu trúc thư mục

```
evidence/
├── 📁 screenshots/              # Screenshot captures
│   ├── 📁 login/               # Login functionality screenshots
│   ├── 📁 cms/                 # CMS module screenshots
│   ├── 📁 partner/             # Partner module screenshots
│   ├── 📁 collection/          # Collection module screenshots
│   ├── 📁 patient/             # Patient management screenshots
│   ├── 📁 dashboard/           # Dashboard screenshots
│   └── 📁 [timestamp]/         # Time-based organization
├── 📁 videos/                  # Video recordings
│   ├── 📁 full-tests/          # Complete test execution videos
│   ├── 📁 failed-tests/        # Failed test recordings
│   └── 📁 specific-features/   # Feature-specific recordings
├── 📁 traces/                  # Playwright traces
│   ├── 📁 successful/          # Successful test traces
│   ├── 📁 failed/              # Failed test traces
│   └── 📁 performance/         # Performance analysis traces
├── 📁 logs/                    # Text-based logs
│   ├── 📁 console/             # Browser console logs
│   ├── 📁 network/             # Network request logs
│   └── 📁 execution/           # Test execution logs
└── 📁 reports/                 # Generated reports
    ├── 📁 html/                # HTML visual reports
    ├── 📁 json/                # Machine-readable reports
    └── 📁 pdf/                 # PDF summary reports
```

## 📸 Screenshot Collection

### 🎯 Automated Screenshot Triggers
- **Before/After Actions**: Capture state changes
- **Error Conditions**: Document failures và exceptions
- **Key Business Steps**: Important workflow milestones
- **Form Submissions**: Before/after form interactions
- **Navigation Events**: Page transitions và redirects

### 📋 Screenshot Naming Convention
```
[module]-[feature]-[action]-[timestamp].png

Examples:
- login-successful-credentials-entered-20241212-143022.png
- cms-content-create-form-submitted-20241212-143045.png  
- partner-registration-documents-uploaded-20241212-143108.png
```

### 🖼️ Screenshot Metadata
Mỗi screenshot bao gồm:
- **Timestamp**: Exact time of capture
- **Test Case**: Which test case generated it
- **Step Description**: Human-readable step description
- **Browser Info**: Browser type, version, viewport size
- **URL**: Current page URL
- **User Context**: Logged-in user information

## 🎥 Video Recording

### 📹 Video Types
- **Full Test Runs**: Complete test execution from start to finish
- **Feature Tests**: Specific functionality demonstrations
- **Error Reproductions**: Failed test scenarios
- **Performance Tests**: Load time và responsiveness testing

### 🎬 Video Settings
```javascript
// playwright.config.ts video settings
use: {
  video: {
    mode: 'retain-on-failure',    // Giữ video khi test fail
    size: { width: 1280, height: 720 }
  }
}
```

### 📊 Video Metadata
- **Duration**: Total recording time
- **Resolution**: Video dimensions
- **Test Coverage**: Which features were tested
- **Outcome**: Pass/fail status
- **Performance Metrics**: Load times, response times

## 🔍 Trace Collection

### 🎭 Playwright Traces
- **DOM Snapshots**: Page state tại mỗi thời điểm
- **Network Activity**: All requests và responses
- **Console Messages**: JavaScript console outputs
- **User Actions**: Mouse clicks, keyboard inputs
- **Timing Information**: Performance metrics

### 📊 Trace Analysis
```bash
# Mở trace file để analyze
npx playwright show-trace evidence/traces/[trace-file].zip

# Features available:
- Timeline view của test execution
- Network request details
- Console message inspection
- Action replay capability
```

## 📋 Log Collection

### 📝 Log Types
- **Console Logs**: Browser console messages
- **Network Logs**: HTTP requests/responses
- **Execution Logs**: Test runner progress
- **Error Logs**: Exception stack traces
- **Performance Logs**: Timing measurements

### 📊 Log Formats
```javascript
// Console log entry
{
  "timestamp": "2024-12-12T14:30:22.123Z",
  "level": "info|warn|error",
  "message": "User login successful",
  "testCase": "login.successful.spec.js",
  "url": "https://medlatec-portal-fe.vercel.app/dashboard"
}

// Network log entry
{
  "timestamp": "2024-12-12T14:30:22.123Z",
  "method": "POST",
  "url": "/api/auth/login",
  "status": 200,
  "responseTime": 245,
  "testCase": "login.successful.spec.js"
}
```

## 🚀 Evidence Usage

### 🔍 Debugging Failed Tests
1. **Check Screenshots**: Visual state khi lỗi xảy ra
2. **Review Video**: Complete execution flow
3. **Analyze Traces**: Detailed step-by-step analysis
4. **Examine Logs**: Error messages và stack traces

### 📊 Performance Analysis
```bash
# Analyze performance từ traces
npm run analyze:performance evidence/traces/performance/

# Generate performance report
npm run report:performance
```

### 📋 Compliance Reporting
- **Healthcare Standards**: HIPAA compliance evidence
- **Quality Assurance**: Testing thoroughness proof
- **Audit Requirements**: Complete testing documentation
- **Stakeholder Reports**: Executive summary with visuals

## ⚠️ Chú ý quan trọng

### 🚨 Storage Management
- **Disk Space**: Evidence có thể consume significant storage
- **Cleanup Policy**: Tự động cleanup old evidence (30 days)
- **Compression**: Videos và traces được compress automatically
- **Archival**: Important evidence được archive long-term

### 🔒 Security & Privacy
- **Sensitive Data**: Mask sensitive information trong screenshots
- **PII Protection**: Remove personal identifiable information
- **Access Control**: Restrict access đến evidence directories
- **Data Retention**: Follow company data retention policies

### 📈 Performance Impact
- **Storage I/O**: Evidence collection có thể slow down tests
- **Network Usage**: Video uploads to cloud storage
- **CPU Usage**: Screenshot/video processing overhead
- **Memory Usage**: Trace collection memory requirements

## 🛠️ Configuration

### ⚙️ Evidence Settings
```javascript
// Evidence collection config
const evidenceConfig = {
  screenshots: {
    enabled: true,
    quality: 90,
    fullPage: false,
    onError: true
  },
  videos: {
    enabled: true,
    mode: 'retain-on-failure',
    quality: 'medium'
  },
  traces: {
    enabled: true,
    screenshots: true,
    snapshots: true
  }
};
```

### 📁 Directory Management
```bash
# Cleanup old evidence (older than 30 days)
npm run evidence:cleanup

# Archive evidence for long-term storage
npm run evidence:archive

# Generate evidence summary report
npm run evidence:report
```

## 📚 Best Practices

### ✅ DO's
- **Meaningful Names**: Clear, descriptive filenames
- **Consistent Structure**: Follow naming conventions
- **Regular Cleanup**: Remove old/unnecessary evidence
- **Metadata Documentation**: Include context information
- **Quality Control**: Review evidence for completeness

### ❌ DON'Ts
- **Excessive Collection**: Don't capture unnecessary evidence
- **Sensitive Data**: Avoid capturing passwords/tokens
- **Large Files**: Optimize file sizes for storage efficiency
- **Manual Management**: Use automated collection tools
- **Poor Organization**: Maintain clear directory structure

---
**📸 Comprehensive Evidence Collection for Quality Assurance**
