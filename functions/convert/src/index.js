import λ from 'apex.js';
import mime from 'mime';
import AWS from 'aws-sdk';
import phantom from 'phantom';
import { v4 as uuid } from 'uuid';
import { createReadStream, unlinkSync } from 'fs';
import contentDisposition from 'content-disposition';

import template from './lib/template';

Promise.coroutine.addYieldHandler(value => Promise.resolve(value));

export default λ(async ({
  name,
  html,
  js = '',
  css = '',
  cssUrls = [],
  jsUrls = [],
  Bucket = 'mario-converter',
  pageConfig,
}) => {
  const key = uuid().split('-').join('');
  const fileName = `${key}-${name}`;
  const filePath = `/tmp/${fileName}`;

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

    // setup s3 uploader
    const params = {
      Bucket,
      Key: fileName,
      Body: createReadStream(filePath),
      ACL: 'public-read',
      ContentDisposition: contentDisposition(filePath),
      ContentType: mime.lookup(filePath),
    };

    const upload = new AWS.S3.ManagedUpload({ params });

    const uploadPromise = new Promise((resolve, reject) => {
      upload.send((err, data) => {
        if (err) { reject(err); }
        resolve(data);
      });
    });

    // then upload to s3
    const { Location } = await uploadPromise;

    // delete the generated pdf
    unlinkSync(filePath);

    // return for user content download link
    return { url: Location };
  } catch (e) {
    // kill phantom js process
    console.log('error', e);
    await instance.exit();
    return e;
  }
});
