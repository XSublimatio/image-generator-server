import { NowRequestHandler } from 'fastify-now';
import { Type } from '@sinclair/typebox';
import { getContractMetadata } from '@faction-nfts/xsublimatio-smart-contracts';

type SuccessfulResponse = {
  name: string;
  description: string;
  image: string;
  external_link: string;
  seller_fee_basis_points: number;
  fee_recipient: string;
  artist: string;
  asset_generator_torrent_hash: string;
};

type FailedResponse = {
  success: boolean;
  error: string;
};

export const GET: NowRequestHandler = async function (
  req,
  res,
): Promise<SuccessfulResponse | FailedResponse> {
  res.code(200);
  return getContractMetadata(process.env.IMAGE_URI, 'webp');
};

GET.opts = {
  schema: {
    params: {
      tokenId: Type.String(),
    },
    response: {
      200: Type.Object({
        name: Type.String(),
        description: Type.String(),
        image: Type.String(),
        external_link: Type.String(),
        seller_fee_basis_points: Type.Number(),
        fee_recipient: Type.String(),
        artist: Type.String(),
        asset_generator_torrent_hash: Type.String(),
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
