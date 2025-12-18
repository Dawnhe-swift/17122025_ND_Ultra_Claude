import { Controller, Get, Param } from '@nestjs/common';
import { ActionsService } from './actions.service';

@Controller()
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Get('/obligations/:id/audit-trail')
  getForObligation(@Param('id') id: string) {
    return this.actionsService.getByObligation(id);
  }

  @Get('/companies/:uen/audit-trail')
  getForCompany(@Param('uen') uen: string) {
    return this.actionsService.getByCompany(uen);
  }
}

