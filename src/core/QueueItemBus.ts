import { Queue } from '@prisma/client';
import prisma from '../lib/prisma';
import { TypedEmitter } from 'tiny-typed-emitter';

interface ITypedEventBus {
  newQueueItem: (queueItem: Queue) => void;
}

class QueueItemBus extends TypedEmitter<ITypedEventBus> {
  constructor() {
    super();

    prisma.$use(async (params, next) => {
      const res = await next(params);

      if (params.model === 'Queue' && params.action === 'create') {
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
