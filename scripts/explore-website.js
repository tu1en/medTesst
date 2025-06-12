const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function exploreWebsite() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: './evidence/videos/',
      size: { width: 1920, height: 1080 }
    }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('Navigating to Medlatec Portal...');
    await page.goto('https://medlatec-portal-fe.vercel.app/login');
    
    // Take initial screenshot
    await page.screenshot({ 
      path: './evidence/screenshots/01-login-page.png',
      fullPage: true 
    });
    
    console.log('Logging in...');
    // Login process
    await page.fill('input[name="username"], input[type="text"]', 'admin');
    await page.fill('input[name="password"], input[type="password"]', '1q2w3E*');
    
    // Take screenshot before login
    await page.screenshot({ 
      path: './evidence/screenshots/02-before-login.png' 
    });
    
    await page.click('button[type="submit"], .login-btn, .btn-login');
    
    // Wait for navigation after login
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: './evidence/screenshots/03-after-login.png',
      fullPage: true 
    });
    
    console.log('Exploring main dashboard...');
    
    // Get all navigation elements
    const navElements = await page.$$eval('nav a, .menu a, .sidebar a, [role="menuitem"]', elements => 
      elements.map(el => ({
        text: el.textContent?.trim(),
        href: el.getAttribute('href'),
        selector: el.tagName.toLowerCase() + (el.className ? '.' + el.className.split(' ').join('.') : '')
      })).filter(item => item.text && item.text.length > 0)
    );
    
    console.log('Found navigation elements:', navElements);
    
    // Get all interactive elements
    const interactiveElements = await page.$$eval('button, .btn, [role="button"], input, select, textarea', elements => 
      elements.map(el => ({
        type: el.tagName.toLowerCase(),
        text: el.textContent?.trim() || el.getAttribute('placeholder') || el.getAttribute('value'),
        selector: el.tagName.toLowerCase() + (el.className ? '.' + el.className.split(' ').join('.') : ''),
        name: el.getAttribute('name'),
        id: el.getAttribute('id')
      }))
    );
    
    // Save exploration data
    const explorationData = {
      timestamp: new Date().toISOString(),
      url: page.url(),
      title: await page.title(),
      navigationElements: navElements,
      interactiveElements: interactiveElements.slice(0, 50), // Limit to avoid too much data
    };
    
    fs.writeFileSync('./data/website-exploration.json', JSON.stringify(explorationData, null, 2));
    
    console.log('Exploration data saved to ./data/website-exploration.json');
    
    // Try to explore different sections
    const sections = [];
    for (const navItem of navElements.slice(0, 10)) { // Explore first 10 navigation items
      try {
        if (navItem.href && !navItem.href.startsWith('http') && !navItem.href.includes('logout')) {
          console.log(`Exploring section: ${navItem.text}`);
          await page.click(`text="${navItem.text}"`);
          await page.waitForLoadState('networkidle');
          
          const sectionData = {
            name: navItem.text,
            url: page.url(),
            title: await page.title(),
            elements: await page.$$eval('button, .btn, [role="button"], input, select, textarea, table, .card, .panel', elements => 
              elements.map(el => ({
                type: el.tagName.toLowerCase(),
                text: el.textContent?.trim()?.substring(0, 100) || '',
                selector: el.tagName.toLowerCase() + (el.className ? '.' + el.className.split(' ').join('.') : ''),
                name: el.getAttribute('name'),
                id: el.getAttribute('id')
              })).slice(0, 20)
            )
          };
          
          sections.push(sectionData);
          
          // Take screenshot of each section
          await page.screenshot({ 
            path: `./evidence/screenshots/section-${navItem.text.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.png`,
            fullPage: true 
          });
          
          await page.waitForTimeout(2000);
        }
      } catch (error) {
        console.log(`Error exploring ${navItem.text}:`, error.message);
      }
    }
    
    // Save sections data
    fs.writeFileSync('./data/website-sections.json', JSON.stringify(sections, null, 2));
    console.log(`Explored ${sections.length} sections. Data saved to ./data/website-sections.json`);
    
  } catch (error) {
    console.error('Error during exploration:', error);
    await page.screenshot({ path: './evidence/screenshots/error-state.png' });
  } finally {
    await context.close();
    await browser.close();
  }
}

exploreWebsite().catch(console.error);
