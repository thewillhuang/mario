import aws from 'aws-sdk';
import gunzip from 'gunzip-maybe';
import tar from 'tar-fs';
import puppeteer from 'puppeteer';
import fs from 'fs';
import { executablePath, setupChromePath, launchOptionForLambda, localChromePath } from './config';

export const setupLocalChrome = () => new Promise((resolve, reject) => {
  fs.createReadStream(localChromePath)
    .on('error', err => reject(err))
    .pipe(gunzip())
    .pipe(tar.extract(setupChromePath))
    .on('error', err => reject(err))
    .on('end', () => resolve());
});

export const isBrowserAvailable = async (browser) => {
  try {
    const version = browser && await browser.version();
    return version;
  } catch (e) {
    return false;
  }
};

const getBrowser = async (browser) => {
  if (!await isBrowserAvailable(browser)) {
    return browser;
  }
  await setupLocalChrome();
  const newBrowser = await puppeteer.launch({
    headless: true,
    executablePath,
    args: launchOptionForLambda,
    dumpio: !!exports.DEBUG,
  });
  return newBrowser;
};

export default getBrowser;
