import QueueItemBus from './QueueItemBus';
import MediaBus from './MediaBus';
import processMedia from './processMedia';
import Estimates from './Estimates';
import QueueItemGetter from './QueueItemGetter';
import { IMediaBus } from './MediaBus';

export let queueItemBus: QueueItemBus;
export let mediaBus: MediaBus;
export let queueItemGetter: QueueItemGetter;
export let estimates: Estimates;

const startCore = async () => {
  queueItemBus = new QueueItemBus();
  mediaBus = new MediaBus();
  queueItemGetter = new QueueItemGetter(mediaBus);
  estimates = new Estimates(mediaBus);

  await estimates.trackEstimates();

  queueItemBus.on('newQueueItem', (queueItem) => {
    mediaBus.feedNewQueueItem(queueItem);
  });

  mediaBus.on('newMedia', ({ tokenId, mediaPath }: IMediaBus['newMedia']) => {
    try {
      return processMedia(tokenId, mediaPath);
    } catch (e) {
      console.error(e);
      console.error('failed');
    }
  });

  await queueItemBus.emitPreviousEvents();
};

export default startCore;
