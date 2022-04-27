import QueueItemBus from './QueueItemBus';
import MediaBus from './MediaBus';
import processMedia from './processMedia';

const startCore = async () => {
  const queueItemBus = new QueueItemBus();
  const mediaBus = new MediaBus();

  queueItemBus.on('newQueueItem', (queueItem) => {
    mediaBus.feedNewQueueItem(queueItem);
  });

  mediaBus.on('newMedia', (...args) => {
    try {
      processMedia(...args);
    } catch (e) {
      console.error(e);
      console.error('failed');
    }
  });

  await mediaBus.start();
  await queueItemBus.emitPreviousEvents();
};

export default startCore;
