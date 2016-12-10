import λ from 'apex.js';
import phantom from 'phantom';
import { readFileAsync, unlinkAsync } from './lib/fs';

import template from './lib/template';

Promise.coroutine.addYieldHandler(value => Promise.resolve(value));

export default λ(async ({
  name,
  html,
  js = '',
  css = '',
  cssUrls = [],
  jsUrls = [],
  pageConfig,
}) => {
  const filePath = `/tmp/${name}.pdf`;

  // setup phantom
  const instance = await phantom.create();
  const page = await instance.createPage();
  try {
    // sets page property
    Object.keys(pageConfig).forEach(config => page.property(config, pageConfig[config]));

    // sets content for phantom to render
    page.property('content', template({ html, css, js, cssUrls, jsUrls }));

    // render the pdf to file path
    await page.render(filePath);

    // kill phantom js process
    await instance.exit();

    // read the pdf as base64
    const content = await readFileAsync(filePath, { encoding: 'base64' });

    // delete the generated pdf
    await unlinkAsync(filePath);

    // return for user content download link
    return content;
  } catch (e) {
    // kill phantom js process
    console.log('error', e);
    await unlinkAsync(filePath);
    await instance.exit();
    return e;
  }
});
