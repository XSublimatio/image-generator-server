import loadConfig from './config';
import { S3Client, PutObjectCommandInput, PutObjectCommand } from '@aws-sdk/client-s3';
import { FileExtension } from 'core/processMedia';

loadConfig();

const s3Client = new S3Client({
  region: 'eu-west-1',
});

interface IUploadFile {
  tokenId: string;
  resolution?: {
    width: number;
    height: number;
  };
  mediaType: FileExtension['type'];
  buffer: Buffer;
}

export const uploadFile = ({ resolution, tokenId, mediaType, buffer }: IUploadFile) => {
  const resolutionPrefix = resolution ? `${resolution.width}x${resolution.height}` : 'original';
  const filename = tokenId;
  const extension = mediaType === 'video' ? 'webm' : 'webp';

  const Key = `${mediaType}/${resolutionPrefix}/${filename}.${extension}`;

  const uploadParams = {
    Key,
    Body: buffer,
    Bucket: 'xsublimation',
  } as PutObjectCommandInput;

  const command = new PutObjectCommand(uploadParams);

  return s3Client.send(command);
};
