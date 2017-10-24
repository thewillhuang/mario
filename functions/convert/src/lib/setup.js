import aws from 'aws-sdk';
import fs from 'fs';
import tar from 'tar';
import puppeteer from 'puppeteer';
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
    .pipe(tar.x({
      C: setupChromePath,
    }))
    .on('error', err => reject(err))
    .on('end', () => resolve());
  fs.readdir(setupChromePath, (err, items) => {
    console.log(items);

    for (let i = 0; i < items.length; i++) {
      console.log(items[i]);
    }
  });
});

const setupS3Chrome = () => new Promise((resolve, reject) => {
  const params = {
    Bucket: remoteChromeS3Bucket,
    Key: remoteChromeS3Key,
  };
  s3.getObject(params)
    .createReadStream()
    .on('error', err => reject(err))
    .pipe(tar.x({
      C: setupChromePath,
    }))
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

const existsLocalChrome = () => new Promise((resolve, reject) => {
  fs.exists(localChromePath, (exists) => {
    resolve(exists);
  });
});

const existsExecutableChrome = () => new Promise((resolve, reject) => {
  fs.exists(executablePath, (exists) => {
    resolve(exists);
  });
});

const setupChrome = async () => {
  if (!await existsExecutableChrome()) {
    if (await existsLocalChrome()) {
      debugLog('setup local chrome');
      await setupLocalChrome();
    } else {
      debugLog('setup s3 chrome');
      await setupS3Chrome();
    }
    debugLog('setup done');
  }
};

const getBrowser = (() => {
  console.log('called getBrowser');
  let browser;
  return async () => {
    if (typeof browser === 'undefined' || !await isBrowserAvailable(browser)) {
      await setupChrome();
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
