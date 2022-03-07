import prisma from '../lib/prisma';
import { unlinkSync } from 'fs';

const processVideo = async (tokenId: string, videoPath: string) => {
  //TODO: Upload to S3 bucket
  await prisma.queue.update({ where: { tokenId }, data: { vidDone: true } });

  try {
    unlinkSync(videoPath);
  } catch (e) {
    console.error(e);
  }
};

export default processVideo;
