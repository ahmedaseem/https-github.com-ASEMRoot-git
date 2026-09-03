import { Injectable } from '@nestjs/common';
import { emailQueue } from './email.queue.js';

@Injectable()
export class EmailService {
  async queueEmail(payload) {
    return emailQueue.add('sendEmail', payload);
  }
}
