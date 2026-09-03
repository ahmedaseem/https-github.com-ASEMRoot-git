import { Module } from '@nestjs/common';
import { TestApiController } from './test-api.controller.js';

@Module({
  controllers: [TestApiController],
})
export class TestApiModule {}
