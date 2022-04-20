import loadConfig from './config';
import cloudinary, { UploadApiResponse } from 'cloudinary';

loadConfig();

type MediaType = 'video' | 'image';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

cloudinary.v2.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export const uploadFile = (filePath: string, tokenId: string, mediaType: MediaType) => {
  const publicId = `faction/xsublimatio/${mediaType}/${tokenId}.webm`;

  return upload(filePath, publicId, mediaType);
};

const upload = (filePath: string, publicId: string, mediaType): Promise<UploadApiResponse> =>
  new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_large(
      filePath,
      {
        resource_type: mediaType,
        public_id: publicId.replace(/\.[^/.]+$/, ''),
      },
      (err, res) => {
        if (err) {
          return reject(err);
        }

        resolve(res);
      },
    );
    // .end(buffer);
  });
