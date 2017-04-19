import λ from 'apex.js';
import phantom from 'phantom';
import { v4 as uuid } from 'uuid';
import { S3, config } from 'aws-sdk';
import mime from 'mime';
import contentDisposition from 'content-disposition';
import zlib from 'zlib';
import disk from 'diskusage';
import fs from './lib/fs';
import template from './lib/template';

const { createReadStream, unlinkAsync } = fs;
const s3 = new S3();

config.setPromisesDependency(global.Promise);

const cleanup = async (instance, filePath) => {
  console.time('file cleanup duration');
  // kill phantom js process
  await instance.exit();
  await unlinkAsync(filePath);
  console.log('freespace', disk.checkSync('/').free);
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
  } = event;
  console.log(`payload size: ${~-encodeURI(JSON.stringify(event)).split(/%..|./).length}`);
  // heartbeat
  if (ping) { return { message: 'ack' }; }

  // lambda only gives write permission on /tmp/
  const Key = `${uuid()}.pdf`;
  const filePath = `/tmp/${Key}`;

  console.time('lambda pdf generation duration');
  // setup phantom
  const instance = await phantom.create();
  const page = await instance.createPage();

  try {
    // sets page property
    Object.keys(pageConfig).forEach(options => page.property(options, pageConfig[options]));

    // sets content for phantom to render
    page.property('content', template({ html, css, js, cssUrls, jsUrls }));

    // render the pdf to file path
    await page.render(filePath);
    console.timeEnd('lambda pdf generation duration');

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
    console.timeEnd('upload pdf to s3 duration');

    // clean up
    cleanup(instance, filePath);

    return { url: Location };
  } catch (e) {
    console.log('error', e);
    // cleanup
    cleanup(instance, filePath);
    return e;
  }
});
