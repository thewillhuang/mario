import λ from 'apex.js';
import phantom from 'phantom';
import { createReadStream, statSync } from 'fs';
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
  page.set('property', template({ html, css }));
  await page.render(filename, { format: 'pdf', quality: 100 });
  await instance.exit();

  const file = createReadStream(filename);
  const stat = statSync(filename);
  console.log('fileSize', stat.size);
  return file;
});
