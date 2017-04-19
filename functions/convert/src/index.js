import λ from 'apex.js';
import phantom from 'phantom';
import { v4 as uuid } from 'uuid';
import { S3, config } from 'aws-sdk';
import mime from 'mime';
import contentDisposition from 'content-disposition';
import zlib from 'zlib';
import fs from './lib/fs';
import template from './lib/template';

const gzip = zlib.createGzip({ level: 9 });
const { createReadStream, unlinkAsync } = fs;
const s3 = new S3();

config.setPromisesDependency(global.Promise);

const cleanup = async (instance, filePath) => {
  // kill phantom js process
  await instance.exit();
  await unlinkAsync(filePath);
};

export default λ(async ({
  ping,
  html = '',
  js = '',
  css = '',
  cssUrls = [],
  jsUrls = [],
  pageConfig,
}) => {
  console.time('duration');
  // heartbeat
  if (ping) { return { message: 'ack' }; }

  // lambda only gives write permission on /tmp/
  const Key = `${uuid()}.pdf`;
  const filePath = `/tmp/${Key}`;

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

    const Body = createReadStream(filePath).pipe(gzip);
    const ContentDisposition = contentDisposition(filePath);
    const ContentType = mime.lookup(filePath);
    const ContentEncoding = 'gzip';
    const ACL = 'public-read';

    const params = {
      ACL,
      Bucket: 'mario-pdf-upload',
      Key,
      Body,
      ContentEncoding,
      ContentDisposition,
      ContentType,
    };

    const upload = s3.upload(params);

    const { Location } = await upload.promise();

    // clean up
    cleanup(instance, filePath);

    console.timeEnd('duration');
    return { url: Location };
  } catch (e) {
    console.log('error', e);
    // cleanup
    cleanup(instance, filePath);
    return e;
  }
});
