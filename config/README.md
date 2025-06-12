# ⚙️ Configuration Directory

## 📋 Tổng quan
Thư mục chứa tất cả các file configuration cho Medlatec Portal Testing Framework, bao gồm browser settings, environment configs, và module-specific configurations.

## 🎯 Mục đích

### 🌐 Environment Management
- **Development**: Local development settings
- **Staging**: Pre-production testing environment
- **Production**: Live environment configurations
- **CI/CD**: Continuous integration settings

### 🔧 Browser Configuration
- **Multi-browser Support**: Chrome, Firefox, Safari configurations
- **Device Emulation**: Mobile và tablet device settings
- **Performance Settings**: Memory, CPU, network configurations
- **Security Settings**: Sandbox, permissions, policies

### 📊 Module Configuration
- **CMS Module**: Content management specific settings
- **Partner Module**: Partner portal configurations
- **Collection Module**: Data collection parameters
- **Authentication**: Login và security configurations

## 📁 Configuration Files

```
config/
├── 📄 playwright.config.js         # Main Playwright configuration
├── 📄 playwright.staging.config.js # Staging environment config
├── 📄 playwright.prod.config.js    # Production environment config
├── 📄 mcp-config.json              # MCP protocol configuration
├── 📄 browser-configs.json         # Browser-specific settings
├── 📄 test-data-config.json        # Test data configurations
├── 📄 evidence-config.json         # Evidence collection settings
├── 📄 security-config.json         # Security và compliance settings
└── 📁 modules/                     # Module-specific configs
    ├── 📄 cms-config.json
    ├── 📄 partner-config.json
    ├── 📄 collection-config.json
    └── 📄 auth-config.json
```

## 🌐 Environment Configurations

### 🔧 Development Environment (`playwright.config.js`)
```javascript
export default defineConfig({
  testDir: './tests',
  baseURL: 'http://localhost:3000',
  use: {
    headless: false,           // Show browser during development
    screenshot: 'on',          // Capture all screenshots
    video: 'on',              // Record all videos
    trace: 'on'               // Generate traces for debugging
  },
  workers: 1,                 // Single worker for debugging
  timeout: 60000,             // Longer timeout for debugging
  retries: 0                  // No retries during development
});
```

### 🚀 Staging Environment (`playwright.staging.config.js`)
```javascript
export default defineConfig({
  testDir: './tests',
  baseURL: 'https://medlatec-portal-staging.vercel.app',
  use: {
    headless: true,            // Headless for CI/CD
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry'
  },
  workers: 2,                 // Parallel execution
  timeout: 30000,             // Standard timeout
  retries: 2                  // Retry failed tests
});
```

### 🏭 Production Environment (`playwright.prod.config.js`)
```javascript
export default defineConfig({
  testDir: './tests',
  baseURL: 'https://medlatec-portal-fe.vercel.app',
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry'
  },
  workers: 4,                 // Maximum parallelism
  timeout: 15000,             // Strict timeout
  retries: 3,                 // Multiple retries for stability
  forbidOnly: true           // Prevent .only in production
});
```

## 🎭 MCP Configuration (`mcp-config.json`)

```json
{
  "server": {
    "name": "Medlatec Portal MCP",
    "version": "1.0.0",
    "port": 8931
  },
  "browser": {
    "browserName": "chromium",
    "headless": false,
    "launchOptions": {
      "channel": "chrome",
      "args": ["--no-sandbox", "--disable-dev-shm-usage"]
    },
    "contextOptions": {
      "viewport": { "width": 1280, "height": 720 },
      "ignoreHTTPSErrors": true
    }
  },
  "evidence": {
    "screenshots": {
      "enabled": true,
      "quality": 90,
      "fullPage": false
    },
    "videos": {
      "enabled": true,
      "mode": "retain-on-failure"
    },
    "traces": {
      "enabled": true,
      "screenshots": true,
      "snapshots": true
    }
  },
  "capabilities": [
    "core",
    "tabs", 
    "pdf",
    "history",
    "wait",
    "files",
    "install",
    "testing"
  ]
}
```

## 🖥️ Browser Configurations (`browser-configs.json`)

```json
{
  "chrome": {
    "channel": "chrome",
    "launchOptions": {
      "args": [
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-web-security",
        "--allow-running-insecure-content"
      ]
    },
    "contextOptions": {
      "viewport": { "width": 1280, "height": 720 },
      "userAgent": "Medlatec-Testing-Bot/1.0"
    }
  },
  "firefox": {
    "launchOptions": {
      "firefoxUserPrefs": {
        "security.tls.insecure_fallback_hosts": "localhost",
        "network.stricttransportsecurity.preloadlist": false
      }
    }
  },
  "safari": {
    "launchOptions": {
      "webkit": true
    },
    "contextOptions": {
      "viewport": { "width": 1280, "height": 720 }
    }
  },
  "mobile": {
    "devices": {
      "iPhone": "iPhone 12",
      "iPad": "iPad Pro",
      "Android": "Pixel 5"
    }
  }
}
```

## 📊 Module-Specific Configurations

### 🎨 CMS Module Config (`modules/cms-config.json`)
```json
{
  "module": "cms",
  "priority": 3,
  "baseURL": "/cms",
  "features": {
    "contentManagement": {
      "enabled": true,
      "maxFileSize": "10MB",
      "allowedFormats": ["jpg", "png", "pdf", "doc"]
    },
    "mediaLibrary": {
      "enabled": true,
      "bulkUpload": true,
      "imageOptimization": true
    },
    "publishingWorkflow": {
      "enabled": true,
      "approvalRequired": true,
      "scheduledPublishing": true
    }
  },
  "testData": {
    "sampleContent": "./data/cms-sample-content.json",
    "testImages": "./data/cms-test-images/"
  }
}
```

### 🤝 Partner Module Config (`modules/partner-config.json`)
```json
{
  "module": "partner",
  "priority": 4,
  "baseURL": "/partners",
  "features": {
    "registration": {
      "enabled": true,
      "documentVerification": true,
      "emailVerification": true
    },
    "contractManagement": {
      "enabled": true,
      "digitalSignature": true,
      "templateLibrary": true
    },
    "performanceTracking": {
      "enabled": true,
      "realTimeMetrics": true,
      "reportGeneration": true
    }
  },
  "compliance": {
    "hipaaRequired": true,
    "insuranceVerification": true,
    "licenseValidation": true
  }
}
```

## 🔒 Security Configuration (`security-config.json`)

```json
{
  "authentication": {
    "sessionTimeout": 1800,
    "maxLoginAttempts": 3,
    "passwordPolicy": {
      "minLength": 8,
      "requireUppercase": true,
      "requireNumbers": true,
      "requireSpecialChars": true
    }
  },
  "dataProtection": {
    "encryptionEnabled": true,
    "piiMasking": true,
    "auditLogging": true
  },
  "testing": {
    "sensitiveDataMasking": true,
    "testDataIsolation": true,
    "securityBoundaryTesting": true
  },
  "compliance": {
    "hipaa": {
      "enabled": true,
      "auditTrail": true,
      "dataMinimization": true
    },
    "gdpr": {
      "enabled": true,
      "consentManagement": true,
      "rightToErasure": true
    }
  }
}
```

## 📋 Test Data Configuration (`test-data-config.json`)

```json
{
  "environments": {
    "development": {
      "database": "medlatec_test_dev",
      "seedData": true,
      "cleanupAfterTests": true
    },
    "staging": {
      "database": "medlatec_test_staging", 
      "seedData": true,
      "cleanupAfterTests": true
    },
    "production": {
      "database": "medlatec_prod",
      "seedData": false,
      "cleanupAfterTests": false,
      "readOnlyMode": true
    }
  },
  "dataGeneration": {
    "patients": {
      "count": 100,
      "anonymized": true,
      "realistic": true
    },
    "appointments": {
      "count": 500,
      "dateRange": "30-days"
    },
    "users": {
      "testAccounts": 10,
      "roles": ["admin", "doctor", "nurse", "receptionist"]
    }
  }
}
```

## 🚀 Usage Examples

### 🔧 Environment-Specific Execution
```bash
# Development environment
npx playwright test --config=config/playwright.config.js

# Staging environment  
npx playwright test --config=config/playwright.staging.config.js

# Production environment
npx playwright test --config=config/playwright.prod.config.js
```

### 📊 Module-Specific Testing
```bash
# CMS module với specific config
npm run test:cms -- --config=config/modules/cms-config.json

# Partner module testing
npm run test:partner -- --config=config/modules/partner-config.json
```

### 🔒 Security Testing
```bash
# Security-focused testing
npm run test:security -- --config=config/security-config.json
```

## ⚠️ Chú ý quan trọng

### 🚨 Security Considerations
- **Credentials**: Never commit real credentials to config files
- **Environment Variables**: Use .env files cho sensitive data
- **Access Control**: Restrict access to production configs
- **Encryption**: Encrypt sensitive configuration values

### 📁 File Management
- **Version Control**: Track config changes in Git
- **Backup**: Regular backup của important configs
- **Documentation**: Document all configuration options
- **Validation**: Validate config files before deployment

### 🔄 Maintenance
- **Regular Updates**: Keep configs updated với framework changes
- **Testing**: Test config changes trong development first
- **Monitoring**: Monitor config impact on test performance
- **Cleanup**: Remove unused configuration options

## 🛠️ Configuration Validation

### ✅ Config Validation Script
```javascript
// validate-config.js
const fs = require('fs');

function validateConfig(configPath) {
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    // Validate required fields
    if (!config.baseURL) {
      throw new Error('baseURL is required');
    }
    
    // Validate browser settings
    if (config.browser && !config.browser.browserName) {
      throw new Error('browserName is required in browser config');
    }
    
    console.log(`✅ Config ${configPath} is valid`);
    return true;
  } catch (error) {
    console.error(`❌ Config ${configPath} is invalid:`, error.message);
    return false;
  }
}
```

### 📋 Best Practices

#### ✅ DO's
- **Environment Separation**: Separate configs cho mỗi environment
- **Clear Naming**: Descriptive config file names
- **Documentation**: Comment complex configuration options
- **Validation**: Validate configs before use
- **Modular Structure**: Break large configs into smaller files

#### ❌ DON'Ts
- **Hard-coded Secrets**: Never commit passwords/tokens
- **Duplicate Config**: Avoid config duplication
- **Overly Complex**: Keep configs simple và readable
- **Missing Defaults**: Always provide sensible defaults
- **Inconsistent Format**: Maintain consistent JSON structure

---
**⚙️ Robust Configuration Management for Medlatec Testing**
