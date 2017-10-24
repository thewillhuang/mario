import path from 'path';

export const launchOptionForLambda = [
    // error when launch(); No usable sandbox! Update your kernel
  '--no-sandbox',
    // error when launch(); Failed to load libosmesa.so
  '--disable-gpu',
    // freeze when newPage()
  '--single-process',
];

export const localChromePath = path.join('headless_shell.tar.gz');

export const setupChromePath = path.join(path.sep, 'tmp');
export const executablePath = path.join(
    setupChromePath,
    'headless_shell',
);

export const DEBUG = true;
