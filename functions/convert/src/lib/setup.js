import aws from 'aws-sdk';
import gunzip from 'gunzip-maybe';
import tar from 'tar-fs';
import puppeteer from 'puppeteer';
import fs from 'fs';
import { executablePath, setupChromePath, remoteChromeS3Key, remoteChromeS3Bucket, launchOptionForLambda, localChromePath, DEBUG } from './config';

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

const debugLog = (log) => {
  if (DEBUG) {
    let message = log;
    if (typeof log === 'function') message = log();
    Promise.resolve(message).then(
      message => console.log(message),
    );
  }
};

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
    debugLog(e); // not opened etc.
    return false;
  }
  return true;
};

const getBrowser = (() => {
  let browser;
  return async () => {
    if (typeof browser === 'undefined' || !await isBrowserAvailable(browser)) {
      await setupLocalChrome();
      browser = await puppeteer.launch({
        headless: true,
        executablePath,
        args: launchOptionForLambda,
        dumpio: !!exports.DEBUG,
      });
      debugLog(async b => `launch done: ${await browser.version()}`);
    }
    return browser;
  };
})();

export default getBrowser;
