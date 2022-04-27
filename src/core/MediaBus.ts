import prisma from '../lib/prisma';
import queueTs from 'queue-ts';
import { Queue } from '@prisma/client';
import { execSync } from 'child_process';
import { TypedEmitter } from 'tiny-typed-emitter';

interface IMediaBus {
  newMedia: (tokenId: string, mediaPath: string) => void;
}

const capacity = 1;

class MediaBus extends TypedEmitter<IMediaBus> {
  queue = new queueTs.Queue(capacity);

  constructor() {
    super();

    this.addToQueue = this.addToQueue.bind(this);
  }

  public feedNewQueueItem(queueItem: Queue) {
    this.addToQueue(queueItem);
  }

  private addToQueue(queueItem: Queue) {
    this.queue.add(() => this.createImg(queueItem));
  }

  private async createImg(queueItem: Queue) {
    try {
      execSync(`
        DISPLAY=:1 ${process.env.PWD}/img-generator/main --tokenId=${queueItem.tokenId} --exitWhenDone --animate --ffmpegPath=/usr/bin --ffmpegThreads=2
      `);

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
    }
  }
}

export default MediaBus;
