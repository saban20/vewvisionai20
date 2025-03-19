/**
 * End-to-End Test Script for VisionAI
 * 
 * This script performs a comprehensive validation of the complete workflow:
 * 1. User login
 * 2. Face scanning and measurement
 * 3. Analysis and recommendation generation
 * 4. Product viewing
 * 
 * To run manually:
 * 1. Start the web app: npm run dev
 * 2. In another terminal: node tests/e2e-test.js
 */

const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  baseUrl: 'http://localhost:5173',
  testUser: {
    username: 'e2etest@example.com',
    password: 'testpass123'
  },
  timeouts: {
    navigationTimeout: 5000,
    waitForElementTimeout: 3000,
    scanningTime: 5000
  },
  testImagePath: path.join(__dirname, 'test-face.jpg')
};

// Main test function
async function runE2ETest() {
  console.log('Starting E2E test for VisionAI...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  let page;
  
  try {
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    // Step 1: Check that the app is running
    console.log('Checking that the application is accessible...');
    await page.goto(config.baseUrl, { waitUntil: 'networkidle2' });
    await page.waitForSelector('h1');
    console.log('✅ Application is accessible');
    
    // Step 2: Navigate to login page
    console.log('Navigating to login page...');
    await page.click('a[href="/login"]');
    await page.waitForSelector('form');
    console.log('✅ Login page loaded');
    
    // Step 3: Perform login
    console.log('Logging in...');
    await page.type('input[name="username"]', config.testUser.username);
    await page.type('input[name="password"]', config.testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    console.log('✅ Login successful');
    
    // Step 4: Check dashboard loads
    console.log('Checking dashboard...');
    await page.waitForSelector('.dashboard-container');
    console.log('✅ Dashboard loaded');
    
    // Step 5: Initiate face scanning
    console.log('Initiating face scanning...');
    await page.click('button.scan-button');
    await page.waitForSelector('.face-scanner-container');
    console.log('✅ Face scanner loaded');
    
    // Step 6: Upload test image for face scanning (mocking camera)
    console.log('Uploading test face image...');
    const inputElement = await page.$('input[type="file"]');
    await inputElement.uploadFile(config.testImagePath);
    await page.waitForTimeout(config.timeouts.scanningTime);
    console.log('✅ Test image processed');
    
    // Step 7: Verify measurements were calculated
    console.log('Verifying measurements...');
    await page.waitForSelector('.measurement-results');
    const measurementResults = await page.evaluate(() => {
      const resultElement = document.querySelector('.measurement-results');
      return resultElement ? resultElement.textContent : '';
    });
    
    if (measurementResults.includes('pupillaryDistance')) {
      console.log('✅ Measurements calculated successfully');
    } else {
      throw new Error('Failed to calculate measurements');
    }
    
    // Step 8: Navigate to analysis page
    console.log('Navigating to analysis page...');
    await page.click('.view-analysis-button');
    await page.waitForSelector('.analysis-container');
    console.log('✅ Analysis page loaded');
    
    // Step 9: Verify recommendations are displayed
    console.log('Checking recommendations...');
    await page.waitForSelector('.product-recommendations');
    const recommendationsCount = await page.evaluate(() => {
      return document.querySelectorAll('.product-card').length;
    });
    
    if (recommendationsCount > 0) {
      console.log(`✅ ${recommendationsCount} product recommendations displayed`);
    } else {
      throw new Error('No product recommendations found');
    }
    
    // Step 10: Complete the test
    console.log('E2E test completed successfully! ✅');
    
  } catch (error) {
    console.error('❌ E2E test failed:', error);
    
    // Take screenshot on failure
    if (page) {
      const screenshot = await page.screenshot({ 
        path: path.join(__dirname, 'error-screenshot.png'),
        fullPage: true
      });
      console.log('Screenshot saved at', path.join(__dirname, 'error-screenshot.png'));
    }
    
  } finally {
    await browser.close();
  }
}

// Run the test
if (require.main === module) {
  runE2ETest().catch(console.error);
} 