import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ExportService } from './export.service';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('/companies/:uen/defense-pack')
  async defensePack(@Param('uen') uen: string, @Res() res: Response) {
    const result = await this.exportService.generateDefensePack(uen);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${uen}-defense-pack.pdf"`);
    res.send(result.pdf);
  }

  @Get('/obligations/report')
  async obligationReport(@Query('status') status: string, @Res() res: Response) {
    const pdf = await this.exportService.generateObligationReport({ status });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="obligation-report.pdf"');
    res.send(pdf);
  }
}

