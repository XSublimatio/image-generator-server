import prisma from '../lib/prisma';
import queueTs from 'queue-ts';
import { Queue } from '@prisma/client';
import { BigNumber } from 'ethers';
import { exec } from 'child_process';
import { getTokenFromId } from '@faction-nfts/xsublimatio-smart-contracts';
import { TypedEmitter } from 'tiny-typed-emitter';
import getCapacity from '../utils/getCapacity';

interface IVideoBus {
  newVideo: (tokenId: string, imagePath: string) => void;
}

const capacity = getCapacity() - 1;

class VideoBus extends TypedEmitter<IVideoBus> {
  queue = new queueTs.Queue(capacity);

  constructor() {
    super();

    this.addToQueue = this.addToQueue.bind(this);
  }

  public async start() {
    const queueItems = (await prisma.queue.findMany()) || [];
    queueItems.forEach(this.addToQueue);
  }

  public feedNewQueueItem(queueItem: Queue) {
    this.addToQueue(queueItem);
  }

  private addToQueue(queueItem: Queue) {
    this.queue.add(() => this.createImg(queueItem));
  }

  private async createImg(queueItem: Queue) {
    const bnTokenId = BigNumber.from(queueItem.tokenId);
    const token = getTokenFromId(bnTokenId);
    const processedMoleculeName = processName(token.name);

    try {
      await exec(`
        ${process.env.PWD}/img-generator/main --seed=${token.seed} --molecule=${processedMoleculeName} --video --filename=${queueItem.tokenId}
      `);
      console.log('emitting videbus');
      this.emit(
        'newVideo',
        queueItem.tokenId,
        `${process.env.PWD}/build/output/${queueItem.tokenId}.mp4`,
      );
    } catch (e) {
      prisma.queue.update({
        where: { id: queueItem.id },
        data: { failed: true },
      });
    }
  }
}

export default VideoBus;

//TODO: This does not account for drug names, as they've not been included in the generator.
const processName = (name: string) => name.toLowerCase().replace('-', '').split(' ')[0];
