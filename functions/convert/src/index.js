import λ from 'apex.js';
import phantom from 'phantom';
import { createReadStream, statSync, unlinkSync } from 'fs';
import template from './lib/template';

Promise.coroutine.addYieldHandler(value => Promise.resolve(value));

export default λ(async ({ filename, html, css }) => {
  console.log('html', html);
  console.log('css', css);
  console.log('filename', filename);
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
    await page.render(filename, { format: 'pdf', quality: 100 });
  } catch (e) {
    return e;
  } finally {
    await instance.exit();
  }

  const file = createReadStream(filename);
  const stat = statSync(filename);
  console.log('fileSize', stat.size);
  unlinkSync(filename);
  return file;
});
