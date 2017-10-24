import gunzip from 'gunzip-maybe';
import tar from 'tar-fs';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const setupLocalChrome = () => new Promise((resolve, reject) => {
  fs.createReadStream(path.join(process.cwd(), './headless_shell.tar.gz'))
    .on('error', err => reject(err))
    .pipe(gunzip())
    .on('error', err => reject(err))
    .pipe(tar.extract('/tmp'))
    .on('error', err => reject(err))
    .on('end', () => resolve(true));
});

const getBrowser = async (browser) => {
  try {
    if (browser !== false) {
      return browser;
    }
    const setup = await setupLocalChrome();
    console.log(setup);
    console.log('tmp dir', fs.readdirSync('/tmp'));
    console.log('headless shell', fs.existsSync('/tmp/headless_shell'));
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
