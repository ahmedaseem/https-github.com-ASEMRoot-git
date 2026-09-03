import {
  Body,
  Controller,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { AiService } from './ai.service.js';

interface AiRequest {
  message?: string;
}

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post()
  async askAI(@Body() body: AiRequest) {
    if (!body || typeof body.message !== 'string') {
      throw new BadRequestException(
        'Request body must contain a string "message".',
      );
    }

    const message = body.message.trim();

    if (!message) {
      throw new BadRequestException(
        'AI message cannot be empty.',
      );
    }

    return this.aiService.ask(message);
  }
}
