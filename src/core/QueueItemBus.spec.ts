import tap from 'tap';
import prisma, { destroyPrismaTest, startPrismaTest } from '../lib/prisma';
import QueueItemBus from './QueueItemBus';

tap.test('Test onNewQueueItem', (t) => {
  t.before(async () => {
    await startPrismaTest();
  });
  t.teardown(async () => {
    await destroyPrismaTest();
  });
  t.plan(1);
  t.test('Should return hello world', async (t) => {
    const item = { data: { tokenId: '0' } };
    const bus = new QueueItemBus();
    bus.on('newQueueItem', (queueItem) => {
      t.match(item.data.tokenId, queueItem.tokenId);
    });

    await prisma.queue.create({ data: { tokenId: '0' } });
  });
});
