import λ from 'apex.js';
import phantom from 'phantom';
import { v4 as uuid } from 'uuid';
import { S3, config } from 'aws-sdk';
import mime from 'mime';
import contentDisposition from 'content-disposition';
import zlib from 'zlib';
import disk from 'diskusage';

import autoprefixed from './lib/autoprefix';
import fs from './lib/fs';
import template from './lib/template';

const { createReadStream, unlinkAsync } = fs;
const s3 = new S3();

config.setPromisesDependency(global.Promise);

const cleanup = async (instance, filePath) => {
  // eslint-disable-next-line
  console.time('file cleanup duration');
  // kill phantom js process
  await instance.exit();
  await unlinkAsync(filePath);
  // eslint-disable-next-line
  console.log(`used: ${575 - (disk.checkSync('/tmp').free / 1000000)} MB`);
  // eslint-disable-next-line
  console.timeEnd('file cleanup duration');
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
  console.time('spin up phantom duration');
  const instance = await phantom.create();
  const page = await instance.createPage();
  // eslint-disable-next-line
  console.timeEnd('spin up phantom duration');
  try {
    // sets page property
    Object.keys(pageConfig).forEach(options => page.property(options, pageConfig[options]));

    // sets content for phantom to render
    page.property('content', template({ html, css: autoprefixed(css), js, cssUrls, jsUrls }));

    // eslint-disable-next-line
    console.time('generate pdf duration');
    // render the pdf to file path
    console.time('delay');
    console.timeEnd('delay');
    await Promise.delay(1000);
    await page.render(filePath, { format, quality: '100' });
    // eslint-disable-next-line
    console.timeEnd('generate pdf duration');
    // eslint-disable-next-line
    console.time('upload pdf to s3 duration');
    const upload = s3.upload({
      ACL: 'public-read',
      Bucket: 'mario-pdf-upload',
      Key,
      Body: createReadStream(filePath).pipe(zlib.createGzip({ level: 9 })),
      ContentEncoding: 'gzip',
      ContentDisposition: contentDisposition(filePath),
      ContentType: mime.lookup(filePath),
    });

    const { Location } = await upload.promise();
    // eslint-disable-next-line
    console.timeEnd('upload pdf to s3 duration');

    // clean up
    cleanup(instance, filePath);

    return { url: Location };
  } catch (e) {
    // eslint-disable-next-line
    console.log('error', e);
    // cleanup
    cleanup(instance, filePath);
    return e;
  }
});
