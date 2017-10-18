import template from './template';

export const generatePdfWithRawContent = async (browser, content) => {
  try {
    console.log('generating raw content');
    const page = await browser.newPage();
    page.setContent(template({ content }));
    const pdf = await page.pdf({ format: 'A4', landscape: true });
    await page.close();
    return pdf;
  } catch (e) {
    console.log('generatePdfWithRawContent error', e);
  }
};

export const generatePdfWithUrl = async (browser, url) => {
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    const pdf = await page.pdf({ format: 'A4', landscape: true });
    await page.close();
    return pdf;
  } catch (e) {
    console.log('generatePdfWithUrl error', e);
  }
};
