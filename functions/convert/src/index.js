import λ from 'apex.js';
import { generatePdfWithRawContent } from './lib/generate';
import { getFromS3, uploadToS3 } from './lib/s3Helpers';

export default λ(async ({ Records }) => {
  const { s3: { object: { key }, bucket: { name: srcBucket } } } = Records[0];
  const destBucket = `${srcBucket}-pdf`;

  const { html, css } = await getFromS3(srcBucket, key);
  uploadToS3(destBucket, key, generatePdfWithRawContent(html, css));
});
