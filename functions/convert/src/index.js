import λ from 'apex.js';
import phantom from 'phantom';

export default λ(async ({ html, css }) => {
  console.log('html', html);
  console.log('css', css);
  console.log('phantom', phantom);
  const instance = await phantom.create();
  const page = await instance.createPage();
  await page.on("onResourceRequested", function (data) {
      console.info('Requesting', data.url);
  });

  const status = await page.open('https://stackoverflow.com/');
  console.log(status);

  const content = await page.property('content');
  console.log(content);

  await instance.exit();
});
