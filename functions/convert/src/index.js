import λ from 'apex.js';
import puppeteer from 'puppeteer';
import { S3, config } from 'aws-sdk';
import mime from 'mime';
import contentDisposition from 'content-disposition';
import template from './lib/template';

const s3 = new S3();

config.setPromisesDependency(global.Promise);

const getFromS3 = (Bucket, Key) => {
  const params = {
    Bucket,
    Key,
  };
  const get = s3.getObject(params);
  return get.promise();
};

const generatePdf = async (html, css) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setContent(template({ html, css }));
  const pdf = await page.pdf({ format: 'A4' });
  await browser.close();
  return pdf;
};

const uploadToS3 = async (Bucket, Key, Body) => {
  const params = {
    Bucket,
    Key,
    Body,
    ContentEncoding: 'gzip',
    ContentDisposition: contentDisposition('pdf'),
    ContentType: mime.lookup('pdf'),
  };
  const upload = s3.upload(params);

  await upload.promise();
};

export default λ(async ({ Records }) => {
  const { s3: { object: { key }, bucket: { name: srcBucket } } } = Records[0];

  const destBucket = `${srcBucket}-pdf`;

  const { html, css } = await getFromS3(srcBucket, key);
  uploadToS3(destBucket, key, generatePdf(html, css));
});
