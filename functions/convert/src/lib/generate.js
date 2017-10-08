import puppeteer from 'puppeteer';
import template from './template';

export const generatePdfWithRawContent = async (html, css) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setContent(template({ html, css }));
  const pdf = await page.pdf({ format: 'A4', landscape: true });
  await browser.close();
  return pdf;
};

export const generatePdfWithUrl = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  const pdf = await page.pdf({ format: 'A4', landscape: true });
  await browser.close();
  return pdf;
};
