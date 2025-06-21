import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { Lead } from './lead.entity';
import { WebhookLog } from 'src/webhook/webhook-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lead, WebhookLog])],
  controllers: [LeadsController],
  providers: [LeadsService],
  exports: [LeadsService]
})
export class LeadsModule {}
