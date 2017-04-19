import λ from 'apex.js';
import phantom from 'phantom';
import { v4 as uuid } from 'uuid';
import { S3, config } from 'aws-sdk';
import mime from 'mime';
import contentDisposition from 'content-disposition';
import fs from './lib/fs';
import template from './lib/template';

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
  const filePath = `/tmp/${uuid()}.pdf`;

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

    const Body = createReadStream(filePath);
    const ContentDisposition = contentDisposition(filePath);
    const ContentType = mime.lookup(filePath);
    console.log(Body, ContentDisposition, ContentType);

    const upload = s3.upload({
      params: {
        Bucket: 'mario-pdf-upload',
        Key: uuid(),
        Body,
        ContentDisposition,
        ContentType,
      },
    });

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
