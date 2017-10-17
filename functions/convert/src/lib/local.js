import puppeteer from 'puppeteer';
import { run } from '../index';
import { DEBUG } from './config';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: process.env.SLOWMO_MS,
    dumpio: !!DEBUG,
        // use chrome installed by puppeteer
  });
  await run(browser)
    .then(result => console.log(result))
    .catch(err => console.error(err));
  await browser.close();
})();
