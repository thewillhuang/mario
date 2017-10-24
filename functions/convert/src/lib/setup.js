import gunzip from 'gunzip-maybe';
import tar from 'tar-fs';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const setupLocalChrome = () => {
  fs.createReadStream(path.join(process.cwd(), './headless_shell.tar.gz'))
    .pipe(gunzip())
    .pipe(tar.extract(path.join(__dirname, '/tmp')));
  console.log(path.join(__dirname, '/tmp/'));
  console.log(fs.readdirSync(path.join(__dirname, '/tmp/')));
};

const getBrowser = async (browser) => {
  try {
    if (browser !== false) {
      return browser;
    }
    setupLocalChrome();
    return await puppeteer.launch({
      headless: true,
      executablePath: path.join(__dirname, '/tmp/headless_shell'),
      args: [
        // error when launch(); No usable sandbox! Update your kernel
        '--no-sandbox',
        // error when launch(); Failed to load libosmesa.so
        '--disable-gpu',
        // freeze when newPage()
        '--single-process',
      ],
    });
  } catch (e) {
    console.log(e);
    console.log('failed to create browser');
    return false;
  }
};

export default getBrowser;
