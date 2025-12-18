import { Controller, Get, Param, Post } from '@nestjs/common';
import { RiskService } from './risk.service';
import { ResignationTriggerService } from './resignation-trigger.service';

@Controller('risk')
export class RiskController {
  constructor(
    private readonly riskService: RiskService,
    private readonly resignationTriggerService: ResignationTriggerService,
  ) {}

  @Get('/companies')
  getExitRecommended() {
    return this.resignationTriggerService.runCheck();
  }

  @Post('/calculate/:uen')
  calculateForCompany(@Param('uen') uen: string) {
    return this.riskService.calculateCompanyRisk(uen);
  }
}

