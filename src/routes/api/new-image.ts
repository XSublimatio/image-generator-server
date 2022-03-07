import { NowRequestHandler } from 'fastify-now';
import { Type } from '@sinclair/typebox';
import prisma from '../../lib/prisma';

type Post = NowRequestHandler<{
  Body: { tokenId: string };
}>;

export const POST: Post = async function (req, res) {
  const { tokenId } = req.body;

  await prisma.queue.create({ data: { tokenId } });

  res.code(202);

  return { success: true };
};

POST.opts = {
  schema: {
    body: {
      tokenId: Type.String(),
    },
    response: {
      202: Type.Object({
        success: Type.Boolean({ default: true }),
      }),
      400: Type.Object({
        success: Type.Boolean({ default: false }),
      }),
      500: Type.Object({
        success: Type.Boolean({ default: false }),
      }),
    },
  },
};
