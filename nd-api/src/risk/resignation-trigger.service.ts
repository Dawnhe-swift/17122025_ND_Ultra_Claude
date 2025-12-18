import { Injectable } from '@nestjs/common';
import { RiskService } from './risk.service';

@Injectable()
export class ResignationTriggerService {
  constructor(private readonly riskService: RiskService) {}

  async runCheck() {
    return this.riskService.checkResignationTriggers();
  }
}


