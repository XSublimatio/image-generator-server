import { Queue } from '@prisma/client';
import prisma from '../lib/prisma';
import { TypedEmitter } from 'tiny-typed-emitter';
import { getTokenFromId } from '@faction-nfts/xsublimatio-smart-contracts/dist/types';

interface ITypedEventBus {
  newQueueItem: (queueItem: Queue) => void;
}

class QueueItemBus extends TypedEmitter<ITypedEventBus> {
  constructor() {
    super();

    prisma.$use(async (params, next) => {
      const isCreatingQueueItem = params.model === 'Queue' && params.action === 'create';

      if (isCreatingQueueItem) {
        const args = params.args as Queue;

        args.type = getType(args);

        params.args = args;
      }

      const res = (await next(params)) as Queue;

      if (isCreatingQueueItem) {
        this.emit('newQueueItem', res);
      }

      return res;
    });
  }

  async emitPreviousEvents() {
    const items = await prisma.queue.findMany({ where: { mediaDone: false } });

    if (items) {
      items.forEach((item) => this.emit('newQueueItem', item));
    }
  }
}

export default QueueItemBus;

function getType(queue: Queue): Queue['type'] {
  const category = getTokenFromId(queue.tokenId).category;

  if (category === 'drug') return 'DRUG';
  else if (category === 'molecule') return 'MOLECULE';

  return undefined;
}
