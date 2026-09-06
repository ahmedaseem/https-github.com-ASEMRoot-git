import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import { SEARCH_QUEUE } from './search.queue.js';
import { SearchJobs } from './search.jobs.js';

@Injectable()
export class SearchQueueService {
  constructor(
    @InjectQueue(SEARCH_QUEUE)
    private readonly searchQueue: Queue,
  ) {}

  async indexUser(data: Record<string, unknown>) {
    return this.searchQueue.add(SearchJobs.INDEX_USER, data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: 100,
      removeOnFail: 500,
    });
  }

  async updateUser(data: Record<string, unknown>) {
    return this.searchQueue.add(SearchJobs.UPDATE_USER, data);
  }

  async deleteUser(data: Record<string, unknown>) {
    return this.searchQueue.add(SearchJobs.DELETE_USER, data);
  }
}
