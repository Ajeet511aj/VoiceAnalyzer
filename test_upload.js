import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // Intercept logs
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.error('REQUEST FAILED:', request.url(), request.failure().errorText));

  // Navigate to local server
  await page.goto('http://localhost:3462/?nocache=1');
  
  // Wait for auth to render
  await page.waitForSelector('#login-email', { timeout: 5000 });
  
  // Log in using demo mode
  await page.evaluate(() => demoLogin());
  
  // Wait for dashboard to render
  await page.waitForSelector('#drop-zone', { timeout: 5000 });
  
  console.log("On dashboard. Mocking file upload...");
  
  // Create a 1MB dummy blob mimicking an mp3 file
  await page.evaluate(() => {
    const dummyBlob = new Blob([new Uint8Array(1024 * 1024)], { type: 'audio/mp3' });
    const dummyFile = new File([dummyBlob], "test.mp3", { type: 'audio/mp3' });
    processSelectedFile(dummyFile);
  });
  
  // Wait for file info to appear
  await page.waitForSelector('#upload-file-info', { visible: true });
  
  console.log("File selected. Clicking analyze...");
  await page.evaluate(() => analyzeUploadedFile());
  
  // Wait for processing view
  await page.waitForSelector('.processing-screen', { timeout: 5000 });
  console.log("On processing view. Waiting for pipeline to finish...");
  
  // Wait 15 seconds to see any errors catching in the pipeline
  await new Promise(r => setTimeout(r, 15000));
  
  await browser.close();
})();
