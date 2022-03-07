import ImageBus from './ImageBus';
import processImage from './processImage';
import processVideo from './processVideo';
import QueueItemBus from './QueueItemBus';
import VideoBus from './VideoBus';

const startCore = async () => {
  const queueItemBus = new QueueItemBus();
  const imageBus = new ImageBus();
  const videoBus = new VideoBus();

  queueItemBus.on('newQueueItem', (queueItem) => {
    imageBus.feedNewQueueItem(queueItem);
    videoBus.feedNewQueueItem(queueItem);
  });

  imageBus.on('newImage', processImage);
  videoBus.on('newVideo', processVideo);

  await imageBus.start();
};

export default startCore;
