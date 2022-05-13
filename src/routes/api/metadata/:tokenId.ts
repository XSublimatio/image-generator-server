import { NowRequestHandler } from 'fastify-now';
import { Type } from '@sinclair/typebox';
import { getTokenFromId } from '@faction-nfts/xsublimatio-smart-contracts';
import prisma from '../../../lib/prisma';
import https from 'https';

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

const tokenExists = async (tokenId: string): Promise<boolean> => {
  const data = JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_call',
    params: [
      {
        to: process.env.CONTRACT,
        // 6352211e is the selector for `ownerOf(uint256)`
        data: `0x6352211e${BigInt(tokenId).toString(16).padStart(64, '0')}`,
      },
      'latest',
    ],
    id: 1,
  });

  const options = {
    hostname: process.env.NODE_RPC_URL,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.on('data', (d) => {
        // TODO: need to test if result only exists if the query does not revert
        resolve(!!d.result);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

export const GET: Get = async function (req, res): Promise<SuccessfulResponse | FailedResponse> {
  const { tokenId } = req.params;

  // if (!tokenExists(tokenId)) {
  //   res.code(400);
  //   return { success: false, error: 'Token does not exist' };
  // }

  // We don't care about a failure here since it doesn't prevent a valid response
  prisma.queue.create({ data: { tokenId } }).catch((err) => {
    console.log(`Prisma queue create failed with : ${err}`);
  });

  try {
    const { metadata, category } = getTokenFromId(
      tokenId,
      process.env.IMAGE_URI,
      process.env.VIDEO_URI,
      'webp',
      'webm',
    );

    const placeholder =
      (category === 'molecule' && MOLECULE_PLACEHOLDER) ||
      (category === 'drug' && DRUG_PLACEHOLDER);

    const metadataResponse = {
      ...metadata,
      placeholder_image: placeholder,
    } as SuccessfulResponse;

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
