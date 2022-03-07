import tap from 'tap';
import QueueItemBus from '../core/QueueItemBus';
import prisma, { destroyPrismaTest, startPrismaTest } from '../lib/prisma';
import VideoBus from './VideoBus';
import { Queue } from '@prisma/client';

let queueItemBus: QueueItemBus;
let videoBus: VideoBus;
let feedNewQueueItem: (queueItem: Queue) => void;

tap.test('Test onNewQueueItem', (t) => {
  t.before(async () => {
    await startPrismaTest();
    queueItemBus = new QueueItemBus();
    videoBus = new VideoBus();
    feedNewQueueItem = (queueItem) => videoBus.feedNewQueueItem(queueItem);

    queueItemBus.on('newQueueItem', feedNewQueueItem);
  });
  t.teardown(async () => {
    queueItemBus.off('newQueueItem', feedNewQueueItem);
    await destroyPrismaTest();
  });
  t.plan(1);
  t.test('Should return hello world', async (t) => {
    const tokenId = '1223321123';
    await prisma.queue.create({ data: { tokenId } });

    videoBus.on('newVideo', (receivedTokenId, imagePath) => {
      t.equal(tokenId, receivedTokenId);
      t.equal(`${process.env.PWD}/build/output/${tokenId}.mp4`, imagePath);
    });
  });
});
