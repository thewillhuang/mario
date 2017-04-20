import λ from 'apex.js';
import phantom from 'phantom';
import { v4 as uuid } from 'uuid';
import { S3, config } from 'aws-sdk';
import mime from 'mime';
import contentDisposition from 'content-disposition';
import zlib from 'zlib';
import disk from 'diskusage';
import { pick } from 'ramda';

import autoprefixed from './lib/autoprefix';
import fs from './lib/fs';
import template from './lib/template';

const { createReadStream, unlinkAsync } = fs;
const s3 = new S3();

config.setPromisesDependency(global.Promise);

const cleanup = async (instance, filePath) => {
  // eslint-disable-next-line
  console.time('file cleanup');
  // kill phantom js process
  await Promise.all([instance.exit(), unlinkAsync(filePath)]);
  // eslint-disable-next-line
  console.log(`used: ${575 - (disk.checkSync('/tmp').free / 1000000)} MB`);
  // eslint-disable-next-line
  console.timeEnd('file cleanup');
};

export default λ(async (event) => {
  const {
    ping,
    html = '',
    js = '',
    css = '',
    cssUrls = [],
    jsUrls = [],
    pageConfig,
    format = 'pdf',
  } = event;
  // eslint-disable-next-line
  console.log(`payload size is ${~-encodeURI(JSON.stringify(event)).split(/%..|./).length / 1000000} MB`);
  // heartbeat
  if (ping) { return { message: 'ack' }; }

  // lambda only gives write permission on /tmp/
  const Key = `${uuid()}.${format}`;
  const filePath = `/tmp/${Key}`;
  // eslint-disable-next-line
  // setup phantom
  // eslint-disable-next-line
  console.time('spin up phantom');
  const instance = await phantom.create();
  const page = await instance.createPage();
  // eslint-disable-next-line
  console.timeEnd('spin up phantom');
  try {
    // sets page property
    Object.keys(pageConfig).forEach(options => page.property(options, pageConfig[options]));

    // sets content for phantom to render
    page.property('content', template({ html, css: autoprefixed(css), js, cssUrls, jsUrls }));

    // eslint-disable-next-line
    console.time('generate content');
    // render the pdf to file path

    await page.render(filePath, { format, quality: '100' });
    // eslint-disable-next-line
    console.timeEnd('generate content');
    // eslint-disable-next-line
    console.time('upload pdf to s3');

    const params = {
      Bucket: 'mario-pdf-upload',
      Key,
      Body: createReadStream(filePath).pipe(zlib.createGzip({ level: 9 })),
      ContentEncoding: 'gzip',
      ContentDisposition: contentDisposition(filePath),
      ContentType: mime.lookup(filePath),
    };
    const upload = s3.upload(params);

    await upload.promise();
    // eslint-disable-next-line
    console.timeEnd('upload pdf to s3');

    // clean up
    cleanup(instance, filePath);
    // eslint-disable-next-line
    console.time('generated signed url');
    const url = s3.getSignedUrl('getObject', pick(['Bucket', 'Key'], params));
    // eslint-disable-next-line
    console.timeEnd('generated signed url');
    return { url };
  } catch (e) {
    // eslint-disable-next-line
    console.log('error', e);
    // cleanup
    cleanup(instance, filePath);
    return e;
  }
});
