import λ from 'apex.js';
import getBrowser from './lib/setup';
import { generatePdfWithRawContent } from './lib/generate';
import { getFromS3, uploadToS3 } from './lib/s3Helpers';

let browser;
export default λ(async ({ Records }) => {
  const { s3: { object: { key }, bucket: { name: srcBucket } } } = Records[0];
  console.log(key, srcBucket);
  const destBucket = `${srcBucket}-processed`;

  console.time('grab content from s3');
  const content = await getFromS3(srcBucket, key);
  console.log(content);
  console.timeEnd('grab content from s3');

  console.time('generate pdf');
  let pdfBuffer;
  if (browser) {
    pdfBuffer = generatePdfWithRawContent(browser, content);
  } else {
    browser = await getBrowser();
    pdfBuffer = generatePdfWithRawContent(browser, content);
  }
  console.timeEnd('generate pdf');

  console.timeEnd('upload pdf to destination bucket');
  await uploadToS3(destBucket, key, pdfBuffer);
  console.timeEnd('upload pdf to destination bucket');
});
