// src/report/report.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('relatorio')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  get() {
    return this.reportService.getReport();
  }
}
