import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebhookLog } from './webhook-log.entity';

@Injectable()
export class WebhookService {
  constructor(@InjectRepository(WebhookLog) private repo: Repository<WebhookLog>) {}

  async send(data: any) {
    try {
      const res = await axios.post(process.env.CRM_WEBHOOK_URL || '', data);
      await this.repo.save({ status: 'success', message: res.statusText, payload: data });
    } catch (err) {
      await this.repo.save({ status: 'failed', message: err.message, payload: data });
    }
  }
}
