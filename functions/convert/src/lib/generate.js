import template from './template';

export const generatePdfWithRawContent = (browser, content) => new Promise(async (resolve, reject) => {
  try {
    console.log('generating raw content');
    const page = await browser.newPage();
    page.setContent(template({ content }));
    const pdf = await page.pdf({ format: 'A4', landscape: true });
    await page.close();
    resolve(pdf);
  } catch (e) {
    reject(e);
  }
});

export const generatePdfWithUrl = (browser, url) => new Promise(async (resolve, reject) => {
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    const pdf = await page.pdf({ format: 'A4', landscape: true });
    await page.close();
    resolve(pdf);
  } catch (e) {
    reject(e);
  }
};
