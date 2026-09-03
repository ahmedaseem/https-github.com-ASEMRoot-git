import { Module } from '@nestjs/common';
import { CacheModule } from './cache.module.js';
import { RedisModule } from './redis.module.js';

@Module({
  imports: [
    RedisModule,
    CacheModule,
  ],
})
export class AppModule {}
