import prisma from '../lib/prisma';
import { unlinkSync } from 'fs';
import { uploadFile } from '../lib/uploadFile';

interface FileExtension {
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

const processMedia = async (tokenId: string, mediaPath: string) => {
  const uploadProcesses = fileExtensions.map(async ({ extension, type }) => {
    const filePath = `${mediaPath}${extension}`;
    await uploadFile(filePath, tokenId, type);
    await unlinkSync(filePath);
  });
  try {
    await Promise.all(uploadProcesses);
    await prisma.queue.update({ where: { tokenId }, data: { mediaDone: true } });
  } catch (e) {
    console.error(e);
  }
};

export default processMedia;
