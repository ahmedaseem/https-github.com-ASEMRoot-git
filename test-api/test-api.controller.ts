import { Controller, Get } from '@nestjs/common';

@Controller()
export class TestApiController {

  @Get('tourism')
  tourism() {
    return {
      status: 'ok',
      service: 'tourism',
      mode: 'test'
    };
  }

  @Get('businesses')
  businesses() {
    return {
      status: 'ok',
      service: 'businesses',
      mode: 'test'
    };
  }

  @Get('products')
  products() {
    return {
      status: 'ok',
      service: 'products',
      mode: 'test'
    };
  }

  @Get('projects')
  projects() {
    return {
      status: 'ok',
      service: 'projects',
      mode: 'test'
    };
  }
}
