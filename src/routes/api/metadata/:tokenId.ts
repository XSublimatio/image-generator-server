import { NowRequestHandler } from 'fastify-now';
import { Type } from '@sinclair/typebox';
import { getTokenFromId } from '@faction-nfts/xsublimatio-smart-contracts';
import prisma from '../../../lib/prisma';

type Get = NowRequestHandler<{
  Params: { tokenId: string };
}>;

type Response = {
  attributes: Array<object>;
  description: string;
  name: string;
  background_color: string;
  image: string;
  animation_url: string;
};

export const GET: Get = async function (req, res): Promise<Response> {
  const { tokenId } = req.params;

  // TODO: error handling with new version of `xsublimatio-smart-contracts`
  const { category, name, seed, type } = getTokenFromId(tokenId);

  const attributes = [
    { trait_type: 'Category', value: category },
    { trait_type: 'Name', value: name },
    { trait_type: 'Seed', value: seed },
    { trait_type: 'type', value: type.toString() },
  ];

  const imageUrl = `${process.env.S3_BUCKET_URL}/${tokenId}.webp`;
  const animationUrl = `${process.env.S3_BUCKET_URL}/${tokenId}.mp4`;

  await prisma.queue.create({ data: { tokenId } }).catch((err) => {
    console.log(`Prisma queue create failed with : ${err}`);
    res.code(500);
    return { success: false, error: 'Server Error' };
  });

  res.code(200);

  return {
    attributes,
    description: `An xSublimatio ${category}`,
    name,
    background_color: 'ffffff',
    image: imageUrl,
    animation_url: animationUrl,
  };
};

GET.opts = {
  schema: {
    params: {
      tokenId: Type.String(),
    },
    response: {
      200: Type.Object({
        attributes: Type.Array(
          Type.Object({
            trait_type: Type.String(),
            value: Type.String(),
          }),
        ),
        description: Type.String(),
        name: Type.String(),
        background_color: Type.String(),
        image: Type.String(),
        animation_url: Type.String(),
      }),
      400: Type.Object({
        success: Type.Boolean({ default: false }),
        error: Type.String(),
      }),
      500: Type.Object({
        success: Type.Boolean({ default: false }),
        error: Type.String(),
      }),
    },
  },
};
