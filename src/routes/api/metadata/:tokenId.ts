import { NowRequestHandler } from 'fastify-now';
import { Type } from '@sinclair/typebox';
import { getTokenFromId } from '@faction-nfts/xsublimatio-smart-contracts';
import prisma from '../../../lib/prisma';
import tokenExists from '../../../utils/tokenExists';

const DRUG_PLACEHOLDER =
  'https://res.cloudinary.com/faction/image/upload/v1652413962/faction/xsublimatio/placeholders/PH_DRUG_bdsvaw.jpg';
const MOLECULE_PLACEHOLDER =
  'https://res.cloudinary.com/faction/image/upload/v1652413962/faction/xsublimatio/placeholders/PH_MOL_baxnpo.jpg';

type Get = NowRequestHandler<{
  Params: { tokenId: string };
}>;

type SuccessfulResponse = {
  attributes: Array<object>;
  description: string;
  name: string;
  background_color: string;
  image: string;
  placeholder_image: string;
  animation_url: string;
};

type FailedResponse = {
  success: boolean;
  error: string;
};

export const GET: Get = async function (req, res): Promise<SuccessfulResponse | FailedResponse> {
  const { tokenId } = req.params;

  if (!(await tokenExists(tokenId))) {
    res.code(400);
    return { success: false, error: 'Token does not exist' };
  }

  try {
    const { metadata, category } = getTokenFromId(
      tokenId,
      process.env.IMAGE_URI,
      process.env.VIDEO_URI,
      'webp',
      'webm',
    );

    // We don't care about a failure here since it doesn't prevent a valid response
    prisma.queue.create({ data: { tokenId } }).catch((err) => {
      console.log(`Prisma queue create failed with : ${err}`);
    });

    const placeholder =
      (category === 'molecule' && MOLECULE_PLACEHOLDER) ||
      (category === 'drug' && DRUG_PLACEHOLDER);

    const metadataResponse = Object.assign(
      { placeholder_image: placeholder },
      metadata,
    ) as SuccessfulResponse;

    res.code(200);
    return metadataResponse;
  } catch (err) {
    res.code(400);
    return { success: false, error: err.toString() };
  }
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
            display_type: Type.Optional(Type.String()),
            value: Type.Union([Type.String(), Type.Number()]),
          }),
        ),
        description: Type.String(),
        name: Type.String(),
        background_color: Type.String(),
        image: Type.String(),
        animation_url: Type.String(),
        placeholder_image: Type.String(),
        artist: Type.String(),
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
