import { NowRequestHandler } from 'fastify-now';
import { Type } from '@sinclair/typebox';
import { getTokenFromId } from '@faction-nfts/xsublimatio-smart-contracts';
import tokenExists from '../../../utils/tokenExists';
import { estimates, queueItemGetter } from '../../../core';
import { Status } from '../../../core/QueueItemGetter';

type Get = NowRequestHandler<{
  Params: { tokenId: string };
}>;

type SuccessfulResponse = {
  estimate: number;
};

type FailedResponse = {
  success: boolean;
  error: string;
};

export const GET: Get = async function (req, res): Promise<SuccessfulResponse | FailedResponse> {
  const { tokenId } = req.params;

  if (!verifyTokenId(tokenId)) {
    res.code(400);
    return { success: false, error: 'Invalid tokenId' };
  }

  if (!(await tokenExists(tokenId))) {
    res.code(400);
    return { success: false, error: 'Token does not exist' };
  }

  const queueItemData = await queueItemGetter.getOrCreateQueueItem(tokenId);

  try {
    if (queueItemData.status === Status.UNFINISHED) {
      const estimate = await estimates.getEstimate(queueItemData);

      res.code(200);
      return {
        estimate,
      };
    } else if (queueItemData.status === Status.FINISHED) {
      res.code(200);
      return {
        estimate: 0,
      };
    }
  } catch (e) {
    console.error(e);

    res.code(500);
    return {
      error: 'Failed getting estimate',
      success: false,
    };
  }
};

GET.opts = {
  schema: {
    params: {
      tokenId: Type.String(),
    },
    response: {
      200: Type.Object({
        estimate: Type.Number(),
      }),
      400: Type.Object({
        success: Type.Boolean({ default: false }),
        error: Type.String(),
      }),
    },
  },
};

const verifyTokenId = (tokenId: string) => {
  try {
    getTokenFromId(tokenId);
    return true;
  } catch (e) {
    return false;
  }
};
