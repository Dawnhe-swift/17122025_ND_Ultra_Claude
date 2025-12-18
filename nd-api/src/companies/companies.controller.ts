import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('risk_flag') risk_flag?: string,
    @Query('search') search?: string,
  ) {
    return this.companiesService.findAll({ status, risk_flag, search });
  }

  @Get(':uen')
  findOne(@Param('uen') uen: string) {
    return this.companiesService.findOne(uen);
  }

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Patch(':uen')
  update(@Param('uen') uen: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(uen, updateCompanyDto);
  }

  @Delete(':uen')
  remove(@Param('uen') uen: string) {
    return this.companiesService.softDelete(uen);
  }
}

