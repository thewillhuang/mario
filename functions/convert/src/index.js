import λ from 'apex.js';
import phantom from 'phantom';
import { v4 as uuid } from 'uuid';
import fs from './lib/fs';
import template from './lib/template';

const { readFileAsync, unlinkAsync } = fs;

Promise.coroutine.addYieldHandler(value => Promise.resolve(value));

export default λ(async ({
  html,
  js = '',
  css = '',
  cssUrls = [],
  jsUrls = [],
  pageConfig,
}) => {
  const filePath = `/tmp/${uuid()}.pdf`;

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

    // return for user content as base64 and let Api Gateway convert to binary
    return content;
  } catch (e) {
    // kill phantom js process
    console.log('error', e);
    await unlinkAsync(filePath);
    await instance.exit();
    return e;
  }
});
