import { Queue, Type, type Type as TypeType } from '@prisma/client';
import prisma from '../lib/prisma';
import MediaBus from './MediaBus';
import { UnfinishedResponse } from './QueueItemGetter';

class Estimates {
  private mediaBus: MediaBus;
  private estimates = {
    [Type.DRUG]: 0,
    [Type.MOLECULE]: 0,
  };

  constructor(mediaBus: MediaBus) {
    this.mediaBus = mediaBus;
  }

  async getEstimate(queueData: UnfinishedResponse): Promise<number> {
    const upcomingQueueItems = this.mediaBus.queueItems.slice(0, queueData.queueIndex + 1);
    const upcomingTypes = upcomingQueueItems.map((queueItem) => queueItem.type);
    const upcomingEstimates = upcomingTypes.map((type) => this.estimates[type]);

    return upcomingEstimates.reduce((a, b) => a + b, 0);
  }

  async task() {
    const queueItems = await prisma.queue.findMany({
      where: { duration: { not: null }, AND: { duration: { not: null } } },
    });

    for (const type of Object.values(Type)) {
      const filteredItems = queueItems.filter((queueItem) => queueItem.type === type);

      if (!filteredItems.length) continue;

      const durationArray = queueItems.map((queueItem) => queueItem.duration);
      const lowest = Math.min(...durationArray);
      const highest = Math.max(...durationArray);
      const average = durationArray.reduce((a, b) => a + b, 0) / filteredItems.length;
      const difference = highest - lowest;

      console.log(`================= ${type} REPORT =================`);
      console.log(`${type} - values: ${JSON.stringify(durationArray)}`);
      console.log(`${type} - min: ${lowest}`);
      console.log(`${type} - max: ${highest}`);
      console.log(`${type} - difference: ${difference}`);

      this.estimates[type] = average;
    }
  }

  async trackEstimates() {
    prisma.$use(async (params, next) => {
      const res: Queue = await next(params);

      if (params.action === 'update' && params.model === 'Queue' && res.duration) {
        this.task();
      }

      return res;
    });

    await this.task();
  }
}

export default Estimates;
