import prisma from '../lib/prisma';
import tokenExists from './tokenExists';

async function efficientTokenExists(tokenId: string): Promise<boolean> {
  const item = await prisma.queue.findUnique({ where: { tokenId } });

  if (item) return true;

  const existsOnMainnet = await tokenExists(
    tokenId,
    process.env.MAINNET_CONTRACT,
    process.env.MAINNET_NODE_RPC_HOSTNAME,
    process.env.MAINNET_NODE_RPC_PATH,
  );

  if (existsOnMainnet) return true;

  return await tokenExists(
    tokenId,
    process.env.TESTNET_CONTRACT,
    process.env.TESTNET_NODE_RPC_HOSTNAME,
    process.env.TESTNET_NODE_RPC_PATH,
  );
}

export default efficientTokenExists;
