import template from './template';

export const generatePdfWithRawContent = async (browser, html, css) => {
  const page = await browser.newPage();
  page.setContent(template({ html, css }));
  const pdf = await page.pdf({ format: 'A4', landscape: true });
  await page.close();
  return pdf;
};

export const generatePdfWithUrl = async (browser, url) => {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  const pdf = await page.pdf({ format: 'A4', landscape: true });
  await page.close();
  return pdf;
};
