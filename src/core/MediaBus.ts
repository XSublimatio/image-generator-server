import prisma from '../lib/prisma';
import queueTs from 'queue-ts';
import { Queue } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';
import getExecutionTime from '../utils/getExecutionTime';
import AwaitEventEmitter from 'await-event-emitter';
import { getTokenFromId } from '@faction-nfts/xsublimatio-smart-contracts/dist/types';

const execCommand = promisify(exec);

export interface IMediaBus {
  newMedia: { tokenId: string; mediaPath: string };
  newQueueItem: { queueIndex: number; queueItem: Queue };
}

const capacity = 1;

class MediaBus extends AwaitEventEmitter {
  queue = new queueTs.Queue(capacity);
  queueItems: Queue[] = [];
  currentItemStartTime: number | null = null;

  constructor() {
    super();

    this.addToQueue = this.addToQueue.bind(this);
  }

  public feedNewQueueItem(queueItem: Queue) {
    this.addToQueue(queueItem);
  }

  private addToQueue(queueItem: Queue) {
    const queueIndex = this.queueItems.length;

    this.queueItems.push(queueItem);
    this.queue.add(() => this.createImg(queueItem));

    this.emit('newQueueItem', { queueIndex, queueItem } as IMediaBus['newQueueItem']);
  }

  private async createImg(queueItem: Queue) {
    try {
      const startTime = getExecutionTime();
      this.currentItemStartTime = getExecutionTime();

      //artwork
      const { globalType } = getTokenFromId(queueItem.tokenId);
      if (globalType === 76) {
        throw new Error('Minting of drug disabled');
      }

      await execCommand(`
        DISPLAY=:1 ${process.env.PWD}/img-generator/main --tokenId=${queueItem.tokenId} --ffmpegPath=/usr/bin --ffmpegThreads=2
      `);

      const endTime = getExecutionTime(startTime);

      await prisma.queue.update({
        where: { id: queueItem.id },
        data: { duration: Math.round(endTime) },
      });

      await this.emit('newMedia', {
        tokenId: queueItem.tokenId,
        mediaPath: `${process.env.PWD}/img-generator/output/${queueItem.tokenId}`,
      } as IMediaBus['newMedia']);
    } catch (e) {
      prisma.queue.update({
        where: { id: queueItem.id },
        data: { failed: true },
      });
    } finally {
      this.currentItemStartTime = null;
      this.queueItems.shift();
    }
  }
}

export default MediaBus;
