import prisma from '../lib/prisma';
import tokenExists from './tokenExists';

async function efficientTokenExists(tokenId: string): Promise<boolean> {
  const item = await prisma.queue.findUnique({ where: { tokenId } });

  if (item) {
    return true;
  } else {
    return await tokenExists(tokenId);
  }
}

export default efficientTokenExists;
