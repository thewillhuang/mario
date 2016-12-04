import λ from 'apex.js';
import phantom from '../services/phantomAsync';

// Promise.coroutine.addYieldHandler(value => Promise.resolve(value));

export default λ(async ({ html, css }) => {
  console.log('html', html);
  console.log('css', css);
  console.log('phantom', phantom);
  const instance = await phantom.createAsync();
  const page = await instance.createPageAsync();
  await page.onAsync('onResourceRequested', (data) => {
      console.info('Requesting', data.url);
  });

  const status = await page.openAsync('https://stackoverflow.com/');
  console.log(status);

  const content = await page.propertyAsync('content');
  console.log(content);
  await instance.exit();
  return content;
});
