import { Controller, Get } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { REDIS } from '../../redis.module.js';
import { Redis } from 'ioredis';

@Controller('cache')
export class CacheController {
  constructor(
    @Inject(REDIS)
    private readonly redis: Redis,
  ) {}

  @Get('ping')
  async ping() {
    const result = await this.redis.ping();

    return {
      redis: result,
    };
  }
}
