const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

class PuppeteerBrowser {
  constructor(headless = true) {
    this.browser = null;
    this.page = null;
    this.headless = headless;
  }

  async setupDriver() {
    this.browser = await puppeteer.launch({
      headless: this.headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      ]
    });
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1366, height: 768 });
  }

  async get(url) {
    await this.page.goto(url, { waitUntil: 'networkidle2' });
    await this.page.waitForTimeout(2000); // equiv time.sleep(2)
  }

  async waitForElement(selector, timeout = 10000) {
    return this.page.waitForSelector(selector, { timeout });
  }

  async close() {
    if (this.page) await this.page.close();
    if (this.browser) await this.browser.close();
  }
}

module.exports = PuppeteerBrowser;

