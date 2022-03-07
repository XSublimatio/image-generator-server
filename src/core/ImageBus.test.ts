import tap from 'tap';
import QueueItemBus from '../core/QueueItemBus';
import prisma, { destroyPrismaTest, startPrismaTest } from '../lib/prisma';
import ImageBus from './ImageBus';
import { Queue } from '@prisma/client';

let queueItemBus: QueueItemBus;
let imageBus: ImageBus;
let feedNewQueueItem: (queueItem: Queue) => void;

tap.test('Test onNewQueueItem', (t) => {
  t.before(async () => {
    await startPrismaTest();
    queueItemBus = new QueueItemBus();
    imageBus = new ImageBus();
    feedNewQueueItem = (queueItem) => imageBus.feedNewQueueItem(queueItem);

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

    imageBus.on('newImage', (receivedTokenId, imagePath) => {
      t.equal(tokenId, receivedTokenId);
      t.equal(`${process.env.PWD}/main/application.linux64/${tokenId}.png`, imagePath);
    });
  });
});
