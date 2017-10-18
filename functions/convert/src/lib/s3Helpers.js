import { S3, config } from 'aws-sdk';
import mime from 'mime';
import contentDisposition from 'content-disposition';

const s3 = new S3();
config.setPromisesDependency(global.Promise);

export const uploadToS3 = async (Bucket, Key, Body) => {
  const params = {
    Bucket,
    Key,
    Body,
    ContentEncoding: 'gzip',
    ContentDisposition: contentDisposition('pdf'),
    ContentType: mime.lookup('pdf'),
  };

  console.log('params in uploadToS3', params);
  const upload = s3.upload(params);

  return upload.promise();
};

export const getFromS3 = (Bucket, Key) => {
  const params = {
    Bucket,
    Key,
  };
  const get = s3.getObject(params);
  return get.promise();
};
