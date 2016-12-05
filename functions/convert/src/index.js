import λ from 'apex.js';
import { S3 } from 'aws-sdk';
import phantom from 'phantom';
import { lookup } from 'mime';
import { v4 as uuid } from 'uuid';
import { createReadStream, unlinkSync } from 'fs';
import contentDisposition from 'content-disposition';

import template from './lib/template';

Promise.coroutine.addYieldHandler(value => Promise.resolve(value));

const s3 = new S3({ apiVersion: '2006-03-01' });

export default λ(async ({
  name,
  html,
  css,
  cssUrl = '',
  Bucket = 'mario-converter',
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
  const Key = uuid().split('-').join('');
  const fileName = `${Key}-${name}`;
  const filePath = `/tmp/${fileName}`;

  // setup phantom
  const instance = await phantom.create();
  const page = await instance.createPage();

  // sets paper size
  page.property('paperSize', {
    format,
    orientation,
  });

  // sets viewport
  page.property('viewportSize', {
    width,
    height,
  });

  // sets content for phantom to render
  page.property('content', template({ html, css, cssUrl }));

  try {
    // render the pdf to file path
    await page.render(filePath);

    // setup s3 uploader
    const Body = createReadStream(filePath);

    console.log('filePath', filePath);
    console.log('Body', Body);
    console.log('lookup', lookup);
    console.log('contentDisposition func', contentDisposition);

    const ContentDisposition = contentDisposition(filePath);
    const ContentType = lookup(filePath);

    console.log('ContentDisposition', ContentDisposition);
    console.log('ContentType', ContentType);

    const params = {
      Bucket,
      Key,
      Body,
      ACL: 'public-read',
      ContentDisposition,
      ContentType,
    };

    console.log('params', params);

    console.log('ManagedUpload', s3.managedUpload);

    const upload = new s3.ManagedUpload(params).promise();

    // then upload to s3
    const result = await upload;

    console.log('upload result', result);

    // kill phantom js process
    await instance.exit();

    // clean up cache
    unlinkSync(filePath);

    // return for user content download link
    return result.Location;
  } catch (e) {
    // kill phantom js process
    console.log('error', e);
    await instance.exit();
    return e;
  }
});
