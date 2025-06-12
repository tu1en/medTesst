# 📁 Scripts Directory

## 📋 Tổng quan
Thư mục chứa tất cả các script tiện ích để chạy tests, automation, và quản lý testing framework.

## 🛠️ Các Scripts có sẵn

### 🚀 Test Execution Scripts

#### **`mcp-test-runner.js`** - MCP Test Runner chính
**Chức năng:**
- Orchestrate toàn bộ test execution theo MCP approach
- Priority-based test execution (1-7)
- Evidence collection tự động
- Multiple report format generation

**Sử dụng:**
```bash
# Chạy tất cả tests với MCP
node scripts/mcp-test-runner.js

# Chạy specific test suite
node scripts/mcp-test-runner.js --suite login
node scripts/mcp-test-runner.js --suite cms
node scripts/mcp-test-runner.js --suite partner
```

#### **`comprehensive-test-runner.js`** - Comprehensive Test Runner
**Chức năng:**
- Chạy tests theo traditional Playwright approach
- Parallel execution support
- Detailed logging và reporting

**Sử dụng:**
```bash
node scripts/comprehensive-test-runner.js
```

### 🔍 Exploration Scripts

#### **`explore-website.js`** - Website Explorer
**Chức năng:**
- Tự động explore website structure
- Identify available pages và functionality
- Generate site map và element catalog

**Sử dụng:**
```bash
node scripts/explore-website.js
```

#### **`mcp-style-exploration.js`** - MCP-Style Exploration  
**Chức năng:**
- Explore website với MCP protocol
- AI-driven page discovery
- Evidence collection during exploration

**Sử dụng:**
```bash
node scripts/mcp-style-exploration.js
```

### 📋 Test Management Scripts

#### **`create-test-cases.js`** - Test Case Generator
**Chức năng:**
- Generate test cases từ requirements
- Create test outlines và specifications
- Template-based test creation

**Sử dụng:**
```bash
node scripts/create-test-cases.js --module cms
node scripts/create-test-cases.js --feature login
```

## 📊 Script Features

### 🎯 Priority-Based Execution
Scripts follow priority order:
1. **Login** (Authentication foundation)
2. **Dashboard** (Main interface)
3. **CMS** (Content management)
4. **Partner** (Partner management)
5. **Collection** (Data collection)
6. **Patient** (Patient management)
7. **User** (User administration)
8. **Appointment** (Scheduling)
9. **Reports** (Analytics)
10. **Settings** (System configuration)

### 📸 Evidence Collection
Tất cả scripts support:
- **Screenshots**: Key steps capture
- **Videos**: Full execution recording
- **Traces**: Playwright debugging traces
- **Logs**: Console và network logs
- **Reports**: HTML/JSON/JUnit formats

### ⚙️ Configuration Management
Scripts sử dụng:
- `playwright.config.ts` - Playwright settings
- `package.json` - NPM script definitions
- `config/` - Custom configurations
- Environment variables

## 🚀 Execution Examples

### Basic Test Execution
```bash
# Chạy login tests
npm run test:login

# Chạy CMS module tests  
npm run test:cms

# Chạy với MCP approach
npm run mcp
```

### Advanced Execution
```bash
# Debug mode
npm run test:debug

# Headed mode (với browser UI)
npm run test:headed

# Specific browser
npm run test -- --project=chromium

# With custom config
npm run test -- --config=playwright.staging.config.ts
```

### Evidence Collection
```bash
# Với screenshot collection
npm run test -- --screenshot=on

# Với video recording
npm run test -- --video=on

# Với trace collection
npm run test -- --trace=on
```

## 📋 Script Parameters

### Common Parameters
- `--suite <name>`: Run specific test suite
- `--headed`: Run với browser UI
- `--debug`: Enable debug mode
- `--screenshot`: Enable screenshot capture
- `--video`: Enable video recording
- `--trace`: Enable trace collection

### Environment Options
- `--env=staging`: Run trên staging environment
- `--env=production`: Run trên production environment
- `--env=local`: Run trên local development

### Output Options
- `--output-dir <path>`: Custom output directory
- `--report-format <format>`: Report format (html, json, junit)
- `--no-cleanup`: Skip cleanup after tests

## ⚠️ Chú ý quan trọng

### 🚨 Environment Setup
- **Node.js**: Required version >= 16.0.0
- **Playwright**: Auto-install browsers khi cần
- **Permissions**: Write access cho evidence directories
- **Network**: Internet access cho website testing

### 🔒 Security Considerations
- **Test Data**: Sử dụng test accounts, không production data
- **Credentials**: Store trong environment variables
- **Cleanup**: Auto-cleanup test artifacts
- **Isolation**: Isolated browser contexts

### 📈 Performance Optimization
- **Parallel Execution**: Multiple browser contexts
- **Resource Management**: Auto-cleanup unused resources
- **Caching**: Browser và context reuse
- **Throttling**: Control execution speed

## 🛠️ Development & Customization

### Adding New Scripts
1. Create script file trong `scripts/`
2. Follow naming convention: `[purpose]-[action].js`
3. Include proper error handling
4. Add to package.json scripts section
5. Document usage và parameters

### Script Template
```javascript
#!/usr/bin/env node

/**
 * [Script Name] - [Brief Description]
 * 
 * Usage: node scripts/[script-name].js [options]
 */

const fs = require('fs');
const path = require('path');

class ScriptName {
  constructor() {
    this.baseDir = process.cwd();
    // Initialize script
  }

  async run() {
    try {
      // Main script logic
      console.log('Script execution started...');
      
      // Your implementation here
      
      console.log('Script execution completed');
    } catch (error) {
      console.error('Script execution failed:', error);
      process.exit(1);
    }
  }
}

// Execute if called directly
if (require.main === module) {
  const script = new ScriptName();
  script.run();
}

module.exports = ScriptName;
```

## 📚 Best Practices

### ✅ DO's
- **Error Handling**: Comprehensive error catching
- **Logging**: Clear progress indication
- **Documentation**: Document script purpose và usage
- **Validation**: Input parameter validation
- **Cleanup**: Proper resource cleanup

### ❌ DON'Ts
- **Hard-coded Paths**: Use relative paths
- **Blocking Operations**: Use async/await properly
- **Resource Leaks**: Always close browsers/contexts
- **Silent Failures**: Log errors appropriately

---
**🛠️ Powerful Test Automation Scripts for Medlatec Portal**
