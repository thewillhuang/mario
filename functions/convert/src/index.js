import λ from 'apex.js';
import getBrowser from './lib/setup';
import { generatePdfWithRawContent } from './lib/generate';
import { getFromS3, uploadToS3 } from './lib/s3Helpers';

let browser;

export default λ(async ({ Records }) => {
  const { s3: { object: { key }, bucket: { name: srcBucket } } } = Records[0];
  const destBucket = `${srcBucket}-processed`;
  console.log(key, srcBucket, destBucket);

  console.time('grab browser');
  browser = await getBrowser(browser);
  console.log(browser);
  console.timeEnd('grab browser');

  console.time('grab content from s3');
  const { Body } = await getFromS3(srcBucket, key);
  console.timeEnd('grab content from s3');

  console.time('generate pdf');
  const content = Body.toString('utf-8');
  const pdfBuffer = await generatePdfWithRawContent(browser, content);
  console.timeEnd('generate pdf');

  console.time('upload pdf to destination bucket');
  await uploadToS3(destBucket, key, pdfBuffer);
  console.timeEnd('upload pdf to destination bucket');
});
