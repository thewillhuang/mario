import λ from 'apex.js';
import phantom from 'phantom';
import { v4 as uuid } from 'uuid';

import fs from './lib/fs';
import template from './lib/template';

const { readFileAsync, unlinkAsync } = fs;

const cleanup = async (instance, filePath) => {
  // kill phantom js process
  await instance.exit();
  await unlinkAsync(filePath);
};

export default λ(async ({
  ping,
  html = '<p>no html content</p>',
  js = '',
  css = '',
  cssUrls = [],
  jsUrls = [],
  pageConfig,
}) => {
  // heartbeat
  if (ping) { return 'heartbeat'; }

  // lambda only gives permission on /tmp/
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

    // read the pdf as base64
    const content = await readFileAsync(filePath, { encoding: 'base64' });

    // clean up
    cleanup(instance, filePath);

    // return for user content as base64 and let Api Gateway convert to binary
    return content;
  } catch (e) {
    console.log('error', e);
    // cleanup
    cleanup(instance, filePath);
    return e;
  }
});
