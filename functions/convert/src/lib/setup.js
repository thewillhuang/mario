import aws from 'aws-sdk';
import gunzip from 'gunzip-maybe';
import tar from 'tar-fs';
import puppeteer from 'puppeteer';
import fs from 'fs';
import { executablePath, setupChromePath, launchOptionForLambda, localChromePath } from './config';

const setupLocalChrome = () => new Promise((resolve, reject) => {
  fs.createReadStream(localChromePath)
    .on('error', err => reject(err))
    .pipe(gunzip())
    .pipe(tar.extract(setupChromePath))
    .on('error', err => reject(err))
    .on('end', () => resolve());
});

const isBrowserAvailable = async (browser) => {
  try {
    await browser.version();
  } catch (e) {
    console.log(e);
    return false;
  }
  return true;
};

const getBrowser = (() => {
  let browser;
  return async () => {
    try {
      if (typeof browser === 'undefined' || !await isBrowserAvailable(browser)) {
        await setupLocalChrome();
        browser = await puppeteer.launch({
          headless: true,
          executablePath,
          args: launchOptionForLambda,
          dumpio: !!exports.DEBUG,
        });
        console.log(await browser.version());
      }
      return browser;
    } catch (e) {
      console.log(e);
      return e;
    }
  };
})();

export default getBrowser;
