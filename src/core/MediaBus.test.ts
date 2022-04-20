import tap from 'tap';
import QueueItemBus from './QueueItemBus';
import prisma, { destroyPrismaTest, startPrismaTest } from '../lib/prisma';
import { Queue } from '@prisma/client';
import MediaBus from './MediaBus';

let queueItemBus: QueueItemBus;
let mediaBus: MediaBus;
let feedNewQueueItem: (queueItem: Queue) => void;

tap.test('Test onNewQueueItem', (t) => {
  t.before(async () => {
    await startPrismaTest();
    queueItemBus = new QueueItemBus();
    mediaBus = new MediaBus();
    feedNewQueueItem = (queueItem) => mediaBus.feedNewQueueItem(queueItem);

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

    mediaBus.on('newMedia', (receivedTokenId, imagePath) => {
      t.equal(tokenId, receivedTokenId);
      t.equal(`${process.env.PWD}/img-generator/output/${tokenId}`, imagePath);
    });
  });
});
