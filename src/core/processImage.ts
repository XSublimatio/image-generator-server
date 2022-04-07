import prisma from '../lib/prisma';
import { unlinkSync } from 'fs';
import { uploadFile } from '../lib/uploadFile';

const processImage = async (tokenId: string, imagePath: string) => {
  await uploadFile(imagePath);

  await prisma.queue.update({ where: { tokenId }, data: { imgDone: true } });

  try {
    unlinkSync(imagePath);
  } catch (e) {
    console.error(e);
  }
};

export default processImage;
