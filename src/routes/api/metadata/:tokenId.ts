import { NowRequestHandler } from 'fastify-now';
import { Type } from '@sinclair/typebox';
import { getTokenFromId } from '@faction-nfts/xsublimatio-smart-contracts';
import prisma from '../../../lib/prisma';

type Get = NowRequestHandler<{
  Params: { tokenId: string };
}>;

type SuccessfulResponse = {
  attributes: Array<object>;
  description: string;
  name: string;
  background_color: string;
  image: string;
  animation_url: string;
};

type FailedResponse = {
  success: boolean;
  error: string;
};

export const GET: Get = async function (req, res): Promise<SuccessfulResponse | FailedResponse> {
  const { tokenId } = req.params;

  let token;

  try {
    token = getTokenFromId(tokenId);
  } catch (err) {
    res.code(400);
    return { success: false, error: err.toString() };
  }

  const { category, name, seed, type } = token;

  const attributes = [
    { trait_type: 'Category', value: category },
    { trait_type: 'Name', value: name },
    { trait_type: 'Seed', value: seed },
    { trait_type: 'type', value: type.toString() },
  ];

  const imageUrl = `${process.env.S3_BUCKET_URL}/${tokenId}.webp`;
  const animationUrl = `${process.env.S3_BUCKET_URL}/${tokenId}.mp4`;

  // We don't care about a failure here since it doesn't prevent a valid response
  prisma.queue.create({ data: { tokenId } }).catch((err) => {
    console.log(`Prisma queue create failed with : ${err}`);
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
