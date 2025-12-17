import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateObligationDto } from './dto/create-obligation.dto';
import { UpdateObligationDto } from './dto/update-obligation.dto';
import { ObligationsService } from './obligations.service';

@UseGuards(JwtAuthGuard)
@Controller('obligations')
export class ObligationsController {
  constructor(private readonly obligationsService: ObligationsService) {}

  @Post()
  create(@Body() dto: CreateObligationDto) {
    return this.obligationsService.create(dto);
  }

  @Get()
  findAll() {
    return this.obligationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.obligationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateObligationDto) {
    return this.obligationsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.obligationsService.remove(id);
  }
}

