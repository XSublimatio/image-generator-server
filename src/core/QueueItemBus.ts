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
    });
  }
}

export default QueueItemBus;
