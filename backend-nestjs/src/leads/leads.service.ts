import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './lead.entity';
import { WebhookLog } from 'src/webhook/webhook-log.entity';
import { GetLeadsQueryDto } from './dto/get-leads-query.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import axios from 'axios';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead) 
    private leadRepo: Repository<Lead>,

    @InjectRepository(WebhookLog) 
    private webhookLogRepo: Repository<WebhookLog>
  ) {}

  // async createLead(data: Partial<Lead>) {
  //   const lead = this.leadRepo.create(data);
  //   await this.leadRepo.save(lead);
  //   try {
  //     await axios.post(process.env.CRM_WEBHOOK_URL || '', lead);
  //   } catch (e) {
  //     console.error('CRM Webhook failed', e.message);
  //   }
  //   return lead;
  // }

  async createLead(data: Partial<Lead>) {
    const lead = this.leadRepo.create(data);
    await this.leadRepo.save(lead);

    // Call webhook and log in background
    this.sendToCrmAndLog(lead); 

    return lead;
  }

  private async sendToCrmAndLog(lead: Lead) {
    const payload = { ...lead };
    let status: 'success' | 'failed' = 'success';
    let message = 'Posted to CRM successfully';
  
    try {
      await axios.post(process.env.CRM_WEBHOOK_URL || '', payload);
    } catch (error: any) {
      status = 'failed';
      message = error?.message || 'CRM webhook call failed';
      console.error('CRM Webhook failed:', message);
    }
  
    // Always save the webhook log
    await this.webhookLogRepo.save({
      status,
      message,
      payload,
    });
  }

  async getLeads(query: GetLeadsQueryDto) {
    const {
      name,
      email,
      source,
      submitted_at_from,
      submitted_at_to,
      searchQuery,
      page = 1,
      limit = 10,
    } = query;
  
    const take = limit;
    const skip = (page - 1) * take;
  
    const qb = this.leadRepo.createQueryBuilder('lead');
    qb.where('lead.isActive = :isActive', { isActive: true });

    if (searchQuery) {
      qb.andWhere(
        '(LOWER(lead.name) ILIKE :search OR LOWER(lead.email) ILIKE :search)',
        { search: `%${searchQuery.toLowerCase()}%` }
      );
    }
  
    if (name) {
      qb.andWhere('LOWER(lead.name) = LOWER(:name)', { name: name });
    }

    if (email) {
      qb.andWhere('LOWER(lead.email) = LOWER(:email)', { email: email });
    }

    // if (isActive != undefined && isActive != null) {
    //   qb.andWhere('lead.isActive = :isActive', { isActive: isActive });
    // }
    
    if (source) {
      qb.andWhere('lead.source ILIKE :source', { source: `%${source}%` });
    }
  
    if (submitted_at_from) {
      qb.andWhere('lead.submitted_at >= :from', { from: submitted_at_from });
    }
  
    if (submitted_at_to) {
      // Append end-of-day time if only a date was passed
      const toDate = new Date(submitted_at_to);
      toDate.setUTCHours(23, 59, 59, 999);
    
      qb.andWhere('lead.submitted_at <= :to', { to: toDate.toISOString() });
    }
  
    qb.skip(skip).take(take);
    qb.orderBy('lead.id', 'DESC')
  
    const [data, total] = await qb.getManyAndCount();
  
    return {
      data,
      total,
      page: page,
      limit: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async getLeadById(id: number) {
    const lead = await this.leadRepo.findOneBy({ id, isActive: true });
  
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    return lead;
  }

  async updateLead(id: number, updateData: UpdateLeadDto) {
    const lead = await this.leadRepo.findOneBy({ id });
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
  
    Object.assign(lead, updateData);
    return this.leadRepo.save(lead);
  }
  
  async softDeleteLead(id: number) {
    const lead = await this.leadRepo.findOneBy({ id, isActive: true });
  
    if (!lead) {
      throw new NotFoundException(`Active lead with ID ${id} not found or already deleted.`);
    }
  
    await this.leadRepo.update({ id }, { isActive: false });
  
    return {
      message: `Lead with ID ${id} has been soft deleted successfully.`,
      success: true,
    };
  }  
}
