import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ObligationsService } from './obligations.service';
import { CreateObligationDto } from './dto/create-obligation.dto';
import { ReviewObligationDto } from './dto/review-obligation.dto';
import { CloseObligationDto } from './dto/close-obligation.dto';

@Controller('obligations')
export class ObligationsController {
  constructor(private readonly obligationsService: ObligationsService) {}

  @Get()
  findAll(@Query('status') status?: string, @Query('company_uen') company_uen?: string, @Query('risk') risk?: string) {
    return this.obligationsService.findAll({ status, company_uen, risk });
  }

  @Get('/overdue')
  findOverdue() {
    return this.obligationsService.findOverdue();
  }

  @Get('/high-risk')
  findHighRisk() {
    return this.obligationsService.findHighRisk();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.obligationsService.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateObligationDto) {
    return this.obligationsService.createObligation(createDto);
  }

  @Post(':id/review')
  review(@Param('id') id: string, @Body() reviewDto: ReviewObligationDto) {
    return this.obligationsService.reviewObligation(id, reviewDto);
  }

  @Post(':id/approve')
  approve(@Param('id') id: string, @Body('ndNotes') ndNotes: string) {
    return this.obligationsService.approveObligation(id, ndNotes);
  }

  @Post(':id/reject')
  reject(@Param('id') id: string, @Body('ndNotes') ndNotes: string) {
    return this.obligationsService.rejectObligation(id, ndNotes);
  }

  @Post(':id/escalate')
  escalate(@Param('id') id: string, @Body('ndNotes') ndNotes: string) {
    return this.obligationsService.escalateObligation(id, ndNotes);
  }

  @Post(':id/close')
  close(@Param('id') id: string, @Body() closeDto: CloseObligationDto) {
    return this.obligationsService.closeObligation(id, closeDto);
  }
}

