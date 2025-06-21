import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookService } from './webhook.service';
import { WebhookLog } from './webhook-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WebhookLog])],
  providers: [WebhookService],
  exports: [WebhookService]
})
export class WebhookModule {}
