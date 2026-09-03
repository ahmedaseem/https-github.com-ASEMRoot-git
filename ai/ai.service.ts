import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  async ask(message: string) {
    const text = message.trim();

    if (!text) {
      throw new Error('AI message cannot be empty.');
    }

    /*
     * Employment AI logic goes here.
     *
     * This first implementation deliberately does not call
     * an external AI provider. It confirms that the backend
     * route and request pipeline are working.
     */
    return {
      success: true,
      message: text,
      response: `ASEM Employment AI received: ${text}`,
      service: 'employment-ai',
    };
  }
}
