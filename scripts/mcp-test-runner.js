#!/usr/bin/env node

/**
 * Medlatec Portal MCP Test Runner
 * Comprehensive testing following MCP (Model Context Protocol) approach
 * 
 * This script orchestrates all test execution with evidence collection
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class MedlatecMCPTestRunner {
  constructor() {
    this.baseDir = process.cwd();
    this.evidenceDir = path.join(this.baseDir, 'evidence');
    this.resultsDir = path.join(this.baseDir, 'test-results');
    this.testSuites = [
      {
        name: 'Login Functionality',
        path: 'tests/login-functionality',
        tests: [
          'login.successful.spec.ts',
          'login.invalid.spec.ts'
        ],
        priority: 1
      },
      {
        name: 'Dashboard Functionality',
        path: 'tests/dashboard-functionality',
        tests: [
          'dashboard.main.spec.ts'
        ],
        priority: 2
      },
      {
        name: 'Patient Management',
        path: 'tests/patient-management',
        tests: [
          'patient.create.spec.ts',
          'patient.search.spec.ts'
        ],
        priority: 3
      },
      {
        name: 'User Management',
        path: 'tests/user-management',
        tests: [
          'user.create.spec.ts',
          'user.roles.spec.ts'
        ],
        priority: 4
      },
      {
        name: 'Appointment Management',
        path: 'tests/appointment-management',
        tests: [
          'appointment.create.spec.ts'
        ],
        priority: 5
      },
      {
        name: 'Reports Functionality',
        path: 'tests/reports-functionality',
        tests: [
          'reports.generate.spec.ts'
        ],
        priority: 6
      },
      {
        name: 'Settings Functionality',
        path: 'tests/settings-functionality',
        tests: [
          'settings.system.spec.ts'
        ],
        priority: 7
      }
    ];
  }

  /**
   * Initialize test environment and directories
   */
  async initialize() {
    console.log('🚀 Initializing Medlatec Portal MCP Test Runner...');
    console.log('📋 Following MCP approach: step-by-step testing with evidence collection');
    
    this.createDirectories();
    await this.verifyEnvironment();
    
    console.log('✅ Test environment ready');
  }

  /**
   * Create directory structure for evidence collection
   */
  createDirectories() {
    const directories = [
      this.evidenceDir,
      path.join(this.evidenceDir, 'screenshots'),
      path.join(this.evidenceDir, 'videos'),
      path.join(this.evidenceDir, 'images'),
      path.join(this.evidenceDir, 'traces'),
      this.resultsDir,
      path.join(this.resultsDir, 'html'),
      path.join(this.resultsDir, 'json'),
      path.join(this.resultsDir, 'junit'),
      path.join(this.baseDir, 'data'),
      path.join(this.baseDir, 'data', 'test-cases'),
      path.join(this.baseDir, 'data', 'results')
    ];

    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created: ${path.relative(this.baseDir, dir)}`);
      }
    });
  }

  /**
   * Verify Playwright and environment setup
   */
  async verifyEnvironment() {
    console.log('🔍 Verifying test environment...');
    
    // Check Playwright installation
    await this.checkPlaywright();
    
    // Verify test files exist
    this.verifyTestFiles();
    
    // Test website connectivity
    await this.testConnectivity();
  }

  /**
   * Check Playwright installation
   */
  async checkPlaywright() {
    return new Promise((resolve, reject) => {
      exec('npx playwright --version', (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Playwright not found. Please install:');
          console.error('   npm install @playwright/test');
          console.error('   npx playwright install');
          reject(error);
        } else {
          console.log(`✅ Playwright: ${stdout.trim()}`);
          resolve();
        }
      });
    });
  }

  /**
   * Verify test files exist
   */
  verifyTestFiles() {
    console.log('📄 Verifying test files...');
    
    let totalFiles = 0;
    let existingFiles = 0;
    
    this.testSuites.forEach(suite => {
      suite.tests.forEach(testFile => {
        totalFiles++;
        const testPath = path.join(this.baseDir, suite.path, testFile);
        if (fs.existsSync(testPath)) {
          existingFiles++;
        } else {
          console.log(`⚠️  Missing: ${path.join(suite.path, testFile)}`);
        }
      });
    });
    
    console.log(`📊 Test files: ${existingFiles}/${totalFiles} found`);
  }

  /**
   * Test website connectivity
   */
  async testConnectivity() {
    console.log('🌐 Testing website connectivity...');
    
    const connectivityTest = `
      const { test, expect } = require('@playwright/test');
      
      test('Connectivity Check', async ({ page }) => {
        try {
          await page.goto('https://medlatec-portal-fe.vercel.app/login', { timeout: 30000 });
          await page.waitForLoadState('networkidle');
          await expect(page).toHaveTitle(/.*/);
          await page.screenshot({ path: './evidence/screenshots/connectivity-test.png' });
          console.log('Website accessible');
        } catch (error) {
          console.error('Website connectivity failed:', error.message);
          throw error;
        }
      });
    `;
    
    const testFile = path.join(this.baseDir, 'temp-connectivity-test.spec.js');
    fs.writeFileSync(testFile, connectivityTest);
    
    return new Promise((resolve) => {
      exec(`npx playwright test ${testFile} --timeout=60000`, { cwd: this.baseDir }, (error, stdout, stderr) => {
        fs.unlinkSync(testFile); // Cleanup
        
        if (error) {
          console.log('❌ Website connectivity check failed');
          console.log(`   ${error.message}`);
          resolve(false);
        } else {
          console.log('✅ Website connectivity confirmed');
          resolve(true);
        }
      });
    });
  }

  /**
   * Run MCP-style comprehensive testing
   */
  async runMCPTests() {
    console.log('\\n🎯 Starting MCP-Style Comprehensive Testing');
    console.log('=' .repeat(60));
    
    const mcpReport = {
      startTime: new Date().toISOString(),
      testSuites: [],
      summary: {
        totalSuites: this.testSuites.length,
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        skippedTests: 0
      }
    };

    // Sort test suites by priority
    const sortedSuites = [...this.testSuites].sort((a, b) => a.priority - b.priority);

    for (const suite of sortedSuites) {
      console.log(`\\n📋 Test Suite ${suite.priority}: ${suite.name}`);
      console.log('-'.repeat(40));
      
      const suiteResult = await this.runTestSuite(suite);
      mcpReport.testSuites.push(suiteResult);
      
      // Update summary
      mcpReport.summary.totalTests += suiteResult.totalTests;
      mcpReport.summary.passedTests += suiteResult.passedTests;
      mcpReport.summary.failedTests += suiteResult.failedTests;
      mcpReport.summary.skippedTests += suiteResult.skippedTests;
      
      // Collect evidence after each suite
      await this.collectSuiteEvidence(suite.name);
    }

    mcpReport.endTime = new Date().toISOString();
    mcpReport.duration = this.calculateDuration(mcpReport.startTime, mcpReport.endTime);
    
    // Generate comprehensive report
    await this.generateMCPReport(mcpReport);
    
    return mcpReport;
  }

  /**
   * Run a specific test suite
   */
  async runTestSuite(suite) {
    const suiteResult = {
      name: suite.name,
      path: suite.path,
      priority: suite.priority,
      tests: [],
      totalTests: suite.tests.length,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0,
      startTime: new Date().toISOString()
    };

    // Check if outline files exist
    await this.displayProgramOutlines(suite);

    for (const testFile of suite.tests) {
      console.log(`\\n  🧪 Running: ${testFile}`);
      
      const testResult = await this.runSingleTest(suite, testFile);
      suiteResult.tests.push(testResult);
      
      if (testResult.status === 'passed') {
        suiteResult.passedTests++;
        console.log(`    ✅ Passed (${testResult.duration}s)`);
      } else if (testResult.status === 'failed') {
        suiteResult.failedTests++;
        console.log(`    ❌ Failed (${testResult.duration}s)`);
        if (testResult.error) {
          console.log(`    📝 Error: ${testResult.error.substring(0, 100)}...`);
        }
      } else {
        suiteResult.skippedTests++;
        console.log(`    ⏭️  Skipped`);
      }
    }

    suiteResult.endTime = new Date().toISOString();
    suiteResult.duration = this.calculateDuration(suiteResult.startTime, suiteResult.endTime);
    
    // Suite summary
    console.log(`\\n  📊 Suite Summary: ${suiteResult.passedTests}✅ ${suiteResult.failedTests}❌ ${suiteResult.skippedTests}⏭️`);
    console.log(`     Duration: ${suiteResult.duration}s`);
    
    return suiteResult;
  }

  /**
   * Display program outlines for MCP approach
   */
  async displayProgramOutlines(suite) {
    const suitePath = path.join(this.baseDir, suite.path);
    
    if (fs.existsSync(suitePath)) {
      const outlineFiles = fs.readdirSync(suitePath)
        .filter(file => file.endsWith('.outline.md'));
      
      if (outlineFiles.length > 0) {
        console.log(`  📋 Program Outlines Available: ${outlineFiles.length}`);
        outlineFiles.forEach(outline => {
          console.log(`     📄 ${outline}`);
        });
      }
    }
  }

  /**
   * Run a single test file
   */
  async runSingleTest(suite, testFile) {
    const testPath = path.join(suite.path, testFile);
    const fullPath = path.join(this.baseDir, testPath);
    
    if (!fs.existsSync(fullPath)) {
      return {
        file: testFile,
        status: 'skipped',
        reason: 'Test file not found',
        duration: 0
      };
    }

    const command = `npx playwright test ${testPath} --reporter=json --output-dir=test-results`;
    
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      exec(command, { 
        cwd: this.baseDir,
        timeout: 300000 // 5 minutes timeout
      }, (error, stdout, stderr) => {
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        
        if (error) {
          resolve({
            file: testFile,
            status: 'failed',
            error: error.message,
            stderr: stderr,
            duration: parseFloat(duration)
          });
        } else {
          resolve({
            file: testFile,
            status: 'passed',
            stdout: stdout,
            duration: parseFloat(duration)
          });
        }
      });
    });
  }

  /**
   * Collect evidence after test suite execution
   */
  async collectSuiteEvidence(suiteName) {
    const evidencePattern = suiteName.toLowerCase().replace(/\\s+/g, '-');
    const screenshotDir = path.join(this.evidenceDir, 'screenshots');
    
    if (fs.existsSync(screenshotDir)) {
      const screenshots = fs.readdirSync(screenshotDir)
        .filter(file => file.includes(evidencePattern));
      
      if (screenshots.length > 0) {
        console.log(`  📸 Evidence Collected: ${screenshots.length} screenshots`);
        
        // Create suite-specific evidence directory
        const suiteEvidenceDir = path.join(this.evidenceDir, evidencePattern);
        if (!fs.existsSync(suiteEvidenceDir)) {
          fs.mkdirSync(suiteEvidenceDir, { recursive: true });
        }
        
        // Copy screenshots to suite directory
        screenshots.forEach(screenshot => {
          const sourcePath = path.join(screenshotDir, screenshot);
          const destPath = path.join(suiteEvidenceDir, screenshot);
          fs.copyFileSync(sourcePath, destPath);
        });
      }
    }
  }

  /**
   * Generate comprehensive MCP report
   */
  async generateMCPReport(mcpReport) {
    console.log('\\n📊 Generating MCP Test Report...');
    
    // Generate JSON report
    const jsonReportPath = path.join(this.resultsDir, 'mcp-test-report.json');
    fs.writeFileSync(jsonReportPath, JSON.stringify(mcpReport, null, 2));
    
    // Generate HTML report
    const htmlReportPath = path.join(this.resultsDir, 'mcp-test-report.html');
    const htmlContent = this.generateHTMLReport(mcpReport);
    fs.writeFileSync(htmlReportPath, htmlContent);
    
    // Generate summary text report
    const summaryPath = path.join(this.resultsDir, 'mcp-test-summary.txt');
    const summaryContent = this.generateSummaryReport(mcpReport);
    fs.writeFileSync(summaryPath, summaryContent);
    
    console.log('📄 Reports generated:');
    console.log(`   📊 JSON: ${path.relative(this.baseDir, jsonReportPath)}`);
    console.log(`   🌐 HTML: ${path.relative(this.baseDir, htmlReportPath)}`);
    console.log(`   📝 Summary: ${path.relative(this.baseDir, summaryPath)}`);
    
    // Display final summary
    this.displayFinalSummary(mcpReport);
  }

  /**
   * Generate HTML report
   */
  generateHTMLReport(mcpReport) {
    const successRate = ((mcpReport.summary.passedTests / mcpReport.summary.totalTests) * 100).toFixed(1);
    
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Medlatec Portal MCP Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .summary-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .skipped { color: #6c757d; }
        .suite { margin: 20px 0; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
        .suite-header { background: #007bff; color: white; padding: 15px; font-weight: bold; }
        .suite-content { padding: 15px; }
        .test { margin: 10px 0; padding: 10px; border-left: 4px solid #ddd; background: #f8f9fa; }
        .test.passed { border-left-color: #28a745; }
        .test.failed { border-left-color: #dc3545; }
        .test.skipped { border-left-color: #6c757d; }
        .progress-bar { width: 100%; height: 20px; background: #e9ecef; border-radius: 10px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #28a745, #28a745); }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏥 Medlatec Portal MCP Test Report</h1>
            <p>Comprehensive testing following Model Context Protocol approach</p>
            <p><strong>Test Run:</strong> ${new Date(mcpReport.startTime).toLocaleString()} - ${new Date(mcpReport.endTime).toLocaleString()}</p>
            <p><strong>Duration:</strong> ${mcpReport.duration}s</p>
        </div>
        
        <div class="summary">
            <div class="summary-card">
                <h3>Total Tests</h3>
                <h2>${mcpReport.summary.totalTests}</h2>
            </div>
            <div class="summary-card">
                <h3 class="passed">Passed</h3>
                <h2 class="passed">${mcpReport.summary.passedTests}</h2>
            </div>
            <div class="summary-card">
                <h3 class="failed">Failed</h3>
                <h2 class="failed">${mcpReport.summary.failedTests}</h2>
            </div>
            <div class="summary-card">
                <h3>Success Rate</h3>
                <h2>${successRate}%</h2>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${successRate}%"></div>
                </div>
            </div>
        </div>
        
        <h2>📋 Test Suite Results</h2>
        ${mcpReport.testSuites.map(suite => `
            <div class="suite">
                <div class="suite-header">
                    ${suite.priority}. ${suite.name} 
                    <span style="float: right;">
                        ${suite.passedTests}✅ ${suite.failedTests}❌ ${suite.skippedTests}⏭️ (${suite.duration}s)
                    </span>
                </div>
                <div class="suite-content">
                    <p><strong>Path:</strong> ${suite.path}</p>
                    ${suite.tests.map(test => `
                        <div class="test ${test.status}">
                            <strong>${test.status === 'passed' ? '✅' : test.status === 'failed' ? '❌' : '⏭️'} ${test.file}</strong>
                            <span style="float: right;">${test.duration}s</span>
                            ${test.error ? `<br><small style="color: #dc3545;">Error: ${test.error}</small>` : ''}
                            ${test.reason ? `<br><small style="color: #6c757d;">Reason: ${test.reason}</small>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('')}
        
        <div style="margin-top: 30px; text-align: center; color: #6c757d;">
            <p>Generated by Medlatec Portal MCP Test Runner</p>
            <p>Following MCP (Model Context Protocol) testing methodology</p>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Generate summary report
   */
  generateSummaryReport(mcpReport) {
    const successRate = ((mcpReport.summary.passedTests / mcpReport.summary.totalTests) * 100).toFixed(1);
    
    let summary = `
MEDLATEC PORTAL MCP TEST REPORT
==============================

Test Run Information:
- Start Time: ${new Date(mcpReport.startTime).toLocaleString()}
- End Time: ${new Date(mcpReport.endTime).toLocaleString()}
- Duration: ${mcpReport.duration} seconds

Summary:
- Total Tests: ${mcpReport.summary.totalTests}
- Passed: ${mcpReport.summary.passedTests} ✅
- Failed: ${mcpReport.summary.failedTests} ❌
- Skipped: ${mcpReport.summary.skippedTests} ⏭️
- Success Rate: ${successRate}%

Test Suite Results:
==================
`;

    mcpReport.testSuites.forEach(suite => {
      summary += `\\n${suite.priority}. ${suite.name}\\n`;
      summary += `   Path: ${suite.path}\\n`;
      summary += `   Results: ${suite.passedTests}✅ ${suite.failedTests}❌ ${suite.skippedTests}⏭️\\n`;
      summary += `   Duration: ${suite.duration}s\\n`;
      
      suite.tests.forEach(test => {
        const status = test.status === 'passed' ? '✅' : test.status === 'failed' ? '❌' : '⏭️';
        summary += `     ${status} ${test.file} (${test.duration}s)\\n`;
        if (test.error) {
          summary += `       Error: ${test.error.substring(0, 80)}...\\n`;
        }
      });
    });

    summary += `\\n\\nGenerated by Medlatec Portal MCP Test Runner\\n`;
    summary += `Following MCP (Model Context Protocol) testing methodology\\n`;
    
    return summary;
  }

  /**
   * Display final summary in console
   */
  displayFinalSummary(mcpReport) {
    const successRate = ((mcpReport.summary.passedTests / mcpReport.summary.totalTests) * 100).toFixed(1);
    
    console.log('\\n' + '='.repeat(60));
    console.log('🏥 MEDLATEC PORTAL MCP TEST EXECUTION COMPLETE');
    console.log('='.repeat(60));
    console.log(`📊 Total Tests: ${mcpReport.summary.totalTests}`);
    console.log(`✅ Passed: ${mcpReport.summary.passedTests}`);
    console.log(`❌ Failed: ${mcpReport.summary.failedTests}`);
    console.log(`⏭️  Skipped: ${mcpReport.summary.skippedTests}`);
    console.log(`🎯 Success Rate: ${successRate}%`);
    console.log(`⏱️  Total Duration: ${mcpReport.duration}s`);
    console.log('='.repeat(60));
    
    if (mcpReport.summary.failedTests > 0) {
      console.log('\\n❌ Failed Tests:');
      mcpReport.testSuites.forEach(suite => {
        suite.tests.forEach(test => {
          if (test.status === 'failed') {
            console.log(`   - ${suite.name}: ${test.file}`);
          }
        });
      });
    }
    
    console.log('\\n📄 Reports available in test-results directory');
    console.log('📸 Evidence collected in evidence directory');
  }

  /**
   * Calculate duration between two timestamps
   */
  calculateDuration(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return ((end - start) / 1000).toFixed(2);
  }

  /**
   * Run specific test suite by name
   */
  async runSpecificSuite(suiteName) {
    const suite = this.testSuites.find(ts => 
      ts.name.toLowerCase().includes(suiteName.toLowerCase())
    );
    
    if (!suite) {
      console.log(`❌ Test suite '${suiteName}' not found`);
      console.log('Available suites:');
      this.testSuites.forEach(ts => {
        console.log(`   - ${ts.name}`);
      });
      return;
    }
    
    console.log(`🎯 Running specific test suite: ${suite.name}`);
    const suiteResult = await this.runTestSuite(suite);
    
    // Generate mini report for single suite
    console.log('\\n📊 Suite Results:');
    console.log(`   Passed: ${suiteResult.passedTests}`);
    console.log(`   Failed: ${suiteResult.failedTests}`);
    console.log(`   Duration: ${suiteResult.duration}s`);
  }
}

// Main execution function
async function main() {
  const runner = new MedlatecMCPTestRunner();
  
  try {
    await runner.initialize();
    
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
      console.log(`
🏥 Medlatec Portal MCP Test Runner

Usage:
  node mcp-test-runner.js                    # Run all tests in MCP mode
  node mcp-test-runner.js --suite <name>     # Run specific test suite
  node mcp-test-runner.js --help             # Show this help

Available Test Suites:
  - login        (Login Functionality)
  - dashboard    (Dashboard Functionality)  
  - patient      (Patient Management)
  - user         (User Management)
  - appointment  (Appointment Management)
  - reports      (Reports Functionality)
  - settings     (Settings Functionality)

Examples:
  node mcp-test-runner.js --suite login
  node mcp-test-runner.js --suite patient
      `);
      return;
    }
    
    if (args.includes('--suite')) {
      const suiteIndex = args.indexOf('--suite');
      if (suiteIndex !== -1 && args[suiteIndex + 1]) {
        const suiteName = args[suiteIndex + 1];
        await runner.runSpecificSuite(suiteName);
      } else {
        console.log('❌ Please specify a test suite name after --suite');
      }
    } else {
      // Run all tests in MCP mode
      const mcpReport = await runner.runMCPTests();
      
      if (mcpReport.summary.failedTests > 0) {
        process.exit(1); // Exit with error code if tests failed
      }
    }
    
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = MedlatecMCPTestRunner;
