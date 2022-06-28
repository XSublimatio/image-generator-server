import { Queue } from '@prisma/client';
import prisma from '../lib/prisma';
import MediaBus, { IMediaBus } from './MediaBus';

export enum Status {
  FINISHED,
  UNFINISHED,
}

interface BaseResponse {
  status: Status;
  queueIndex?: number;
  queueItem?: Queue;
}

export interface UnfinishedResponse extends BaseResponse {
  status: Status.UNFINISHED;
  queueIndex: number;
  queueItem: Queue;
}

export interface FinishedResponse extends BaseResponse {
  status: Status.FINISHED;
  queueItem: Queue;
}

class QueueItemGetter {
  private mediaBus: MediaBus;

  constructor(mediaBus: MediaBus) {
    this.mediaBus = mediaBus;
  }

  async getOrCreateQueueItem(tokenId: string): Promise<UnfinishedResponse | FinishedResponse> {
    const queueItem = await prisma.queue.findUnique({ where: { tokenId } });

    if (!queueItem) {
      return await this.createQueueItem(tokenId);
    }

    if (queueItem.mediaDone) {
      return {
        status: Status.FINISHED,
        queueItem,
      };
    }

    const queueIndex = this.mediaBus.queueItems.findIndex(
      (memQueueItem) => memQueueItem.tokenId === tokenId,
    );

    return {
      status: Status.UNFINISHED,
      queueItem,
      queueIndex,
    };
  }

  private async createQueueItem(tokenId: string): Promise<UnfinishedResponse> {
    await prisma.queue.create({ data: { tokenId } });

    return await new Promise((resolve, reject) => {
      let success: boolean | null = null;

      this.mediaBus.on('newQueueItem', ({ queueIndex, queueItem }: IMediaBus['newQueueItem']) => {
        if (queueItem.tokenId !== tokenId && success !== null) return;

        success = true;

        resolve({
          status: Status.UNFINISHED,
          queueIndex,
          queueItem,
        });
      });

      setTimeout(() => {
        if (success !== null) return;

        success = false;
        reject('timeout');
      }, 3000);
    });
  }
}

export default QueueItemGetter;
