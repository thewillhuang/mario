import λ from 'apex.js';
import phantom from 'phantom';
import { readFileSync, unlinkSync } from 'fs';
import template from './lib/template';

Promise.coroutine.addYieldHandler(value => Promise.resolve(value));

export default λ(async ({ filename, html, css }) => {
  const file = `/tmp/${filename}`;
  const instance = await phantom.create();
  const page = await instance.createPage();

  page.property('paperSize', {
    format: 'A4',
    orientation: 'landscape',
  });

  page.property('viewportSize', {
    width: 1056,
    height: 816,
  });

  page.property('content', template({ html, css }));

  try {
    await page.render(file);
  } catch (e) {
    return e;
  } finally {
    await instance.exit();
  }

  const bitmap = readFileSync(file);
  unlinkSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString('base64');
});
