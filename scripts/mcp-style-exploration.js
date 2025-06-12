const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function exploreWebsiteWithMCPApproach() {
  console.log('Starting systematic website exploration following MCP approach...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 // Slow down to observe actions
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: './evidence/videos/',
      size: { width: 1920, height: 1080 }
    }
  });
  
  const page = await context.newPage();
  
  // Store exploration results
  const explorationData = {
    timestamp: new Date().toISOString(),
    steps: [],
    functionalities: [],
    elements: {},
    evidence: []
  };
  
  try {
    // Step 1: Navigate to login page (following MCP approach)
    console.log('Step 1: Navigating to login page...');
    await page.goto('https://medlatec-portal-fe.vercel.app/login');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot equivalent to browser_take_screenshot
    await page.screenshot({ 
      path: './evidence/screenshots/step-01-login-page.png',
      fullPage: true 
    });
    
    explorationData.steps.push({
      step: 1,
      action: 'browser_navigate',
      url: 'https://medlatec-portal-fe.vercel.app/login',
      result: 'success',
      screenshot: 'step-01-login-page.png'
    });
    
    // Step 2: Capture page snapshot (browser_snapshot equivalent)
    console.log('Step 2: Analyzing login page elements...');
    const loginElements = await page.evaluate(() => {
      const elements = [];
      
      // Find input fields
      document.querySelectorAll('input').forEach((input, index) => {
        elements.push({
          type: 'input',
          ref: `input_${index}`,
          inputType: input.type,
          name: input.name || '',
          id: input.id || '',
          placeholder: input.placeholder || '',
          className: input.className || '',
          selector: input.tagName.toLowerCase() + 
                   (input.id ? '#' + input.id : '') + 
                   (input.className ? '.' + input.className.split(' ').join('.') : ''),
          visible: input.offsetParent !== null
        });
      });
      
      // Find buttons
      document.querySelectorAll('button, [type="submit"]').forEach((button, index) => {
        elements.push({
          type: 'button',
          ref: `button_${index}`,
          text: button.textContent?.trim() || '',
          className: button.className || '',
          type_attr: button.type || '',
          selector: button.tagName.toLowerCase() + 
                   (button.id ? '#' + button.id : '') + 
                   (button.className ? '.' + button.className.split(' ').join('.') : ''),
          visible: button.offsetParent !== null
        });
      });
      
      // Find links
      document.querySelectorAll('a').forEach((link, index) => {
        elements.push({
          type: 'link',
          ref: `link_${index}`,
          text: link.textContent?.trim() || '',
          href: link.href || '',
          className: link.className || '',
          selector: link.tagName.toLowerCase() + 
                   (link.id ? '#' + link.id : '') + 
                   (link.className ? '.' + link.className.split(' ').join('.') : ''),
          visible: link.offsetParent !== null
        });
      });
      
      return elements.filter(el => el.visible);
    });
    
    explorationData.elements.loginPage = loginElements;
    console.log('Found elements:', loginElements.length);
    
    // Step 3: Enter username (browser_type equivalent)
    console.log('Step 3: Entering username...');
    const usernameField = loginElements.find(el => 
      el.type === 'input' && 
      (el.inputType === 'text' || el.inputType === 'email' || el.name?.includes('user') || el.placeholder?.toLowerCase().includes('user'))
    );
    
    if (usernameField) {
      await page.fill(usernameField.selector, 'admin');
      explorationData.steps.push({
        step: 3,
        action: 'browser_type',
        element: usernameField.selector,
        text: 'admin',
        result: 'success'
      });
    }
    
    // Step 4: Enter password (browser_type equivalent)
    console.log('Step 4: Entering password...');
    const passwordField = loginElements.find(el => 
      el.type === 'input' && el.inputType === 'password'
    );
    
    if (passwordField) {
      await page.fill(passwordField.selector, '1q2w3E*');
      explorationData.steps.push({
        step: 4,
        action: 'browser_type',
        element: passwordField.selector,
        text: '1q2w3E*',
        result: 'success'
      });
    }
    
    // Step 5: Click login button (browser_click equivalent)
    console.log('Step 5: Clicking login button...');
    const loginButton = loginElements.find(el => 
      el.type === 'button' && 
      (el.type_attr === 'submit' || el.text?.toLowerCase().includes('login') || el.text?.toLowerCase().includes('sign'))
    );
    
    if (loginButton) {
      await page.click(loginButton.selector);
      explorationData.steps.push({
        step: 5,
        action: 'browser_click',
        element: loginButton.selector,
        result: 'success'
      });
    }
    
    // Step 6: Wait for navigation and capture result
    console.log('Step 6: Waiting for login result...');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: './evidence/screenshots/step-06-after-login.png',
      fullPage: true 
    });
    
    const currentUrl = page.url();
    const isLoggedIn = !currentUrl.includes('/login');
    
    explorationData.steps.push({
      step: 6,
      action: 'login_verification',
      currentUrl: currentUrl,
      isLoggedIn: isLoggedIn,
      result: isLoggedIn ? 'success' : 'failed',
      screenshot: 'step-06-after-login.png'
    });
    
    if (isLoggedIn) {
      console.log('Login successful! Exploring main application...');
      
      // Step 7: Explore main functionalities
      console.log('Step 7: Capturing main page elements...');
      const mainPageElements = await page.evaluate(() => {
        const elements = [];
        
        // Navigation elements
        document.querySelectorAll('nav a, .menu a, .sidebar a, [role="menuitem"], .nav-item').forEach((nav, index) => {
          if (nav.offsetParent !== null) {
            elements.push({
              type: 'navigation',
              ref: `nav_${index}`,
              text: nav.textContent?.trim() || '',
              href: nav.href || '',
              className: nav.className || '',
              selector: nav.tagName.toLowerCase() + 
                       (nav.id ? '#' + nav.id : '') + 
                       (nav.className ? '.' + nav.className.split(' ').join('.') : '')
            });
          }
        });
        
        // Action buttons
        document.querySelectorAll('button, .btn, [role="button"]').forEach((btn, index) => {
          if (btn.offsetParent !== null) {
            elements.push({
              type: 'action_button',
              ref: `action_${index}`,
              text: btn.textContent?.trim() || '',
              className: btn.className || '',
              selector: btn.tagName.toLowerCase() + 
                       (btn.id ? '#' + btn.id : '') + 
                       (btn.className ? '.' + btn.className.split(' ').join('.') : '')
            });
          }
        });
        
        // Tables and data displays
        document.querySelectorAll('table, .table, .data-table, .grid').forEach((table, index) => {
          if (table.offsetParent !== null) {
            elements.push({
              type: 'data_display',
              ref: `table_${index}`,
              className: table.className || '',
              rowCount: table.querySelectorAll('tr').length,
              selector: table.tagName.toLowerCase() + 
                       (table.id ? '#' + table.id : '') + 
                       (table.className ? '.' + table.className.split(' ').join('.') : '')
            });
          }
        });
        
        // Form elements
        document.querySelectorAll('form, .form').forEach((form, index) => {
          if (form.offsetParent !== null) {
            elements.push({
              type: 'form',
              ref: `form_${index}`,
              className: form.className || '',
              inputCount: form.querySelectorAll('input, select, textarea').length,
              selector: form.tagName.toLowerCase() + 
                       (form.id ? '#' + form.id : '') + 
                       (form.className ? '.' + form.className.split(' ').join('.') : '')
            });
          }
        });
        
        return elements;
      });
      
      explorationData.elements.mainPage = mainPageElements;
      
      // Identify functionalities based on navigation elements
      const functionalities = [];
      mainPageElements.filter(el => el.type === 'navigation').forEach(nav => {
        const text = nav.text.toLowerCase();
        let functionality = 'unknown';
        
        if (text.includes('dashboard') || text.includes('home')) {
          functionality = 'dashboard-functionality';
        } else if (text.includes('user') || text.includes('account') || text.includes('profile')) {
          functionality = 'user-management';
        } else if (text.includes('patient') || text.includes('customer')) {
          functionality = 'patient-management';
        } else if (text.includes('appointment') || text.includes('schedule')) {
          functionality = 'appointment-management';
        } else if (text.includes('report') || text.includes('analytics')) {
          functionality = 'reports-functionality';
        } else if (text.includes('setting') || text.includes('config')) {
          functionality = 'settings-functionality';
        } else if (nav.text.trim()) {
          functionality = nav.text.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-functionality';
        }
        
        if (functionality !== 'unknown') {
          functionalities.push({
            name: functionality,
            navigationText: nav.text,
            selector: nav.selector,
            href: nav.href
          });
        }
      });
      
      explorationData.functionalities = functionalities;
      console.log('Identified functionalities:', functionalities.map(f => f.name));
      
      // Step 8: Explore each functionality briefly
      for (let i = 0; i < Math.min(functionalities.length, 8); i++) {
        const func = functionalities[i];
        try {
          console.log(`Step ${8 + i}: Exploring ${func.name}...`);
          
          if (func.href && !func.href.includes('logout') && !func.href.includes('javascript:')) {
            await page.click(func.selector);
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);
            
            // Take screenshot
            await page.screenshot({ 
              path: `./evidence/screenshots/functionality-${func.name}.png`,
              fullPage: true 
            });
            
            // Analyze page elements
            const funcElements = await page.evaluate(() => {
              return {
                title: document.title,
                url: window.location.href,
                forms: document.querySelectorAll('form, .form').length,
                tables: document.querySelectorAll('table, .table, .data-table').length,
                buttons: document.querySelectorAll('button, .btn, [role="button"]').length,
                inputs: document.querySelectorAll('input, select, textarea').length
              };
            });
            
            explorationData.steps.push({
              step: 8 + i,
              action: 'functionality_exploration',
              functionality: func.name,
              url: funcElements.url,
              elements: funcElements,
              screenshot: `functionality-${func.name}.png`
            });
          }
        } catch (error) {
          console.log(`Error exploring ${func.name}:`, error.message);
        }
      }
    }
    
    // Save exploration data
    fs.writeFileSync('./data/comprehensive-exploration.json', JSON.stringify(explorationData, null, 2));
    console.log('Exploration data saved to ./data/comprehensive-exploration.json');
    
  } catch (error) {
    console.error('Error during exploration:', error);
    await page.screenshot({ path: './evidence/screenshots/error-exploration.png' });
    explorationData.error = error.message;
  } finally {
    await context.close();
    await browser.close();
  }
  
  return explorationData;
}

if (require.main === module) {
  exploreWebsiteWithMCPApproach().catch(console.error);
}

module.exports = { exploreWebsiteWithMCPApproach };
