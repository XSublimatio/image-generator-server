import prisma from '../lib/prisma';
import { unlinkSync } from 'fs';
import { uploadFile } from '../lib/uploadFile';

const processVideo = async (tokenId: string, videoPath: string) => {
  await uploadFile(videoPath);

  await prisma.queue.update({ where: { tokenId }, data: { vidDone: true } });

  try {
    unlinkSync(videoPath);
  } catch (e) {
    console.error(e);
  }
};

export default processVideo;
