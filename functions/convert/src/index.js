import λ from 'apex.js';
import phantom from 'phantom';
import { readFileSync, unlinkSync } from 'fs';
import template from './lib/template';

Promise.coroutine.addYieldHandler(value => Promise.resolve(value));

export default λ(async ({
  filename,
  html,
  css,
  paperSize: {
    format,
    orientation,
  } = {
    format: 'A4',
    orientation: 'landscape',
  },
  viewportSize: {
    width,
    height,
  } = {
    width: 1056,
    height: 816,
  },
}) => {
  const file = `/tmp/${filename}`;
  const instance = await phantom.create();
  const page = await instance.createPage();

  page.property('paperSize', {
    format,
    orientation,
  });

  page.property('viewportSize', {
    width,
    height,
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
  return new Buffer(bitmap).toString('base64');
});
