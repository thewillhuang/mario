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
  Bucket,
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
  const Key = uuid().split('-').join();
  const fileName = `${Key}-${name}`;
  const filePath = `/tmp/${fileName}`;

  // setup phantom
  const instance = await phantom.create();
  const { property, render } = await instance.createPage();

  // sets paper size
  property('paperSize', {
    format,
    orientation,
  });

  // sets viewport
  property('viewportSize', {
    width,
    height,
  });

  // sets content for phantom to render
  property('content', template({ html, css, cssUrl }));

  try {
    // render the pdf to file path
    await render(filePath);

    // setup s3 uploader
    const Body = createReadStream(filePath);
    const params = {
      Bucket,
      Key,
      Body,
      ACL: 'public-read',
      ContentDisposition: contentDisposition(filePath),
      ContentType: lookup(filePath),
    };
    const upload = new s3.ManagedUpload(params).promise();

    // then upload to s3
    const { Location } = await upload;

    // clean up cache
    unlinkSync(filePath);

    // return for user content download link
    return Location;
  } catch (e) {
    return e;
  } finally {
    // exit the instance
    await instance.exit();
  }
});
