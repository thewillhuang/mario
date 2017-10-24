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
    .on('end', () => resolve(true));
});

const getBrowser = async (browser) => {
  try {
    if (typeof browser !== 'undefined') {
      return browser;
    }
    if (await setupLocalChrome()) {
      return await puppeteer.launch({
        headless: true,
        executablePath,
        args: launchOptionForLambda,
        dumpio: !!exports.DEBUG,
      });
    }
    console.log('failed to create browser');
    return undefined;
  } catch (e) {
    console.log(e);
    console.log('failed to create browser');
    return undefined;
  }
};

export default getBrowser;
