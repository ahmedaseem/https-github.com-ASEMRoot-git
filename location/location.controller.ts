import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('location')
export class LocationController {

  @Get()
  getLocation() {
    return {
      status: 'ok',
      service: 'location',
      mode: 'test',
    };
  }

  @Post()
  saveLocation(@Body() body: any) {
    return {
      status: 'ok',
      service: 'location',
      mode: 'test',
      saved: body,
    };
  }
}
