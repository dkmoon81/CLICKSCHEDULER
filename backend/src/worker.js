const puppeteer = require('puppeteer');
const config = require('../config.json');

async function runClickJob(job) {
  if (!job) throw new Error('No job provided');
  const browser = await puppeteer.launch({ headless: config.puppeteer.headless });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(config.runTimeoutSeconds * 1000 || 60000);

  try {
    await page.goto(job.url, { waitUntil: 'networkidle2' });

    if (job.credentials) {
      // naive auto-fill using provided loginSelectors or common defaults
      const ls = job.loginSelectors || {};
      const userSel = ls.username || "input[name='email'], input[type='email'], input[id*=user], input[id*=email]";
      const passSel = ls.password || "input[type='password'], input[name='password'], input[id*=pass]";
      const submitSel = ls.submit || "button[type='submit']";

      const userHandle = await page.$(userSel);
      const passHandle = await page.$(passSel);
      if (userHandle && passHandle) {
        await page.type(userSel, job.credentials.username || '');
        await page.type(passSel, job.credentials.password || '');
        const submitHandle = await page.$(submitSel);
        if (submitHandle) await submitHandle.click();
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
      }
    }

    const el = await page.$(job.clickSelector);
    if (!el) throw new Error('Click target not found: ' + job.clickSelector);
    await el.click();

    await browser.close();
    return { success: true, ranAt: new Date().toISOString() };
  } catch (err) {
    try { await browser.close(); } catch (e) {}
    return { success: false, error: err.message, ranAt: new Date().toISOString() };
  }
}

module.exports = { runClickJob };
