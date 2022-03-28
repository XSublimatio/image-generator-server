import prisma from '../lib/prisma';
import sharp from 'sharp';
import { unlinkSync } from 'fs';
import { uploadFile } from '../lib/uploadFile';

const tempDir = `${process.env.PWD}/temp`;

const processImage = async (tokenId: string, imagePath: string) => {
  const filePath = `${tempDir}/${tokenId}.webp`;

  await sharp(imagePath).webp().toFile(filePath);

  await uploadFile(filePath);

  await prisma.queue.update({ where: { tokenId }, data: { imgDone: true } });

  try {
    unlinkSync(filePath);
    unlinkSync(imagePath);
  } catch (e) {
    console.error(e);
  }
};

export default processImage;
