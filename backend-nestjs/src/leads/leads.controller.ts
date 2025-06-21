import { Controller, Post, Get, Param, Put, Delete, Body, Query, ParseIntPipe } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { Lead } from './lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { GetLeadsQueryDto } from './dto/get-leads-query.dto';

import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('leads')
@Controller('api/leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @ApiOperation({ summary: 'Create a new lead' })
  @Post()
  create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.createLead(createLeadDto);
  }

  @ApiOperation({ summary: 'Get all Leads' })
  @Get()
  findAll(@Query() query: GetLeadsQueryDto) {
    return this.leadsService.getLeads(query);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.leadsService.getLeadById(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLeadDto: UpdateLeadDto
  ) {
    return this.leadsService.updateLead(id, updateLeadDto);
  }

  @Delete(':id')
  softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.leadsService.softDeleteLead(id);
  }
}
