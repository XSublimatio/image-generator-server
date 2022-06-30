import prisma from '../lib/prisma';
import { readFileSync, unlinkSync } from 'fs';
import { uploadFile } from '../lib/uploadFile';
import resizeImage from '../utils/resizeImage';
import convertImageToWebp from '../utils/convertImageToWebp';

export interface FileExtension {
  extension: string;
  type: 'image' | 'video';
}

const fileExtensions = [
  {
    extension: '.png',
    type: 'image',
  },
  {
    extension: '.webm',
    type: 'video',
  },
] as FileExtension[];

type types = FileExtension['type'];

const sizes = {
  image: [
    {
      width: 300,
      height: 300,
    },
  ],
  video: [],
} as {
  [K in types]: { height: number; width: number }[];
};

const processMedia = async (tokenId: string, mediaPath: string) => {
  try {
    for await (const { extension, type } of fileExtensions) {
      const filePath = `${mediaPath}${extension}`;
      const buffer = readFileSync(filePath);

      if (type === 'image') {
        const webpImage = await convertImageToWebp(buffer);

        await uploadFile({ buffer: webpImage, tokenId, mediaType: type });
      } else {
        await uploadFile({ buffer: buffer, tokenId, mediaType: type });
      }

      for await (const resolution of sizes[type]) {
        if (type === 'video') return;

        const resizedImageBuffer = await resizeImage(buffer, resolution);

        await uploadFile({ resolution, tokenId, mediaType: type, buffer: resizedImageBuffer });
      }

      await unlinkSync(filePath);
    }

    await prisma.queue.update({ where: { tokenId }, data: { mediaDone: true } });
  } catch (e) {
    console.error(e);
  }
};

export default processMedia;
