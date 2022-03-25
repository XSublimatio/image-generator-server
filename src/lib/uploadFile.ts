import { S3, S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { createReadStream } from 'fs';
import { basename } from 'path';
import loadConfig from './config';

loadConfig();

const region = process.env.AWS_BUCKET_REGION;
const bucketName = process.env.AWS_BUCKET_NAME;
const accessKey = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
/**
 * S3 Bucket is expected to be publically accessible
 * IAM access should only allow the creation of objectss
 */

const s3Client = new S3Client({
  region: region,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
});

export const uploadFile = async (filePath: string) => {
  const fileStream = createReadStream(filePath);

  const uploadParams = {
    Key: basename(filePath),
    Bucket: bucketName,
    Body: fileStream,
    ACL: 'public-read',
  } as PutObjectCommandInput;

  const command = new PutObjectCommand(uploadParams);

  await s3Client.send(command);
};
