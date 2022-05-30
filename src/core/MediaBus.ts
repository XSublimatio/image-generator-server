import prisma from '../lib/prisma';
import queueTs from 'queue-ts';
import { Queue } from '@prisma/client';
import { exec } from 'child_process';
import { TypedEmitter } from 'tiny-typed-emitter';
import { promisify } from 'util';
import getExecutionTime from '../utils/getExecutionTime';

const execCommand = promisify(exec);

interface IMediaBus {
  newMedia: (tokenId: string, mediaPath: string) => void;
  newQueueItem: (queueIndex: number, queueItem: Queue) => void;
}

const capacity = 1;

class MediaBus extends TypedEmitter<IMediaBus> {
  queue = new queueTs.Queue(capacity);
  queueItems: Queue[] = [];

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

    this.emit('newQueueItem', queueIndex, queueItem);
  }

  private async createImg(queueItem: Queue) {
    try {
      const startTime = getExecutionTime();

      await execCommand(`
        DISPLAY=:1 ${process.env.PWD}/img-generator/main --tokenId=${queueItem.tokenId} --ffmpegPath=/usr/bin --ffmpegThreads=2
      `);

      const endTime = getExecutionTime(startTime);

      await prisma.queue.update({
        where: { id: queueItem.id },
        data: { duration: Math.round(endTime) },
      });

      this.emit(
        'newMedia',
        queueItem.tokenId,
        `${process.env.PWD}/img-generator/output/${queueItem.tokenId}`,
      );
    } catch (e) {
      prisma.queue.update({
        where: { id: queueItem.id },
        data: { failed: true },
      });
    } finally {
      this.queueItems.shift();
    }
  }
}

export default MediaBus;
