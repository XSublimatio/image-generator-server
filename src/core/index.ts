import QueueItemBus from './QueueItemBus';
import MediaBus from './MediaBus';
import processMedia from './processMedia';
import { trackEstimates } from './estimates';

const startCore = async () => {
  const queueItemBus = new QueueItemBus();
  const mediaBus = new MediaBus();

  await trackEstimates();

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

  await queueItemBus.emitPreviousEvents();
};

export default startCore;
