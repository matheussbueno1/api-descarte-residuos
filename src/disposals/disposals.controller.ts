// src/disposals/disposals.controller.ts
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { DisposalsService } from './disposals.service';
import { CreateDisposalDto } from './dto/create-disposal.dto';

@Controller('descartes')
export class DisposalsController {
  constructor(private readonly disposalsService: DisposalsService) {}

  @Post()
  create(@Body() dto: CreateDisposalDto) {
    return this.disposalsService.create(dto);
  }

  @Get()
  findAll(
    @Query('pointId') pointId?: string,
    @Query('wasteType') wasteType?: string,
    @Query('userName') userName?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const filters: any = {};
    if (pointId) filters.pointId = pointId;
    if (wasteType) filters.wasteType = wasteType;
    if (userName) filters.userName = userName;
    if (from || to) filters.date = {};
    if (from) filters.date.$gte = new Date(from);
    if (to) filters.date.$lte = new Date(to);
    return this.disposalsService.findAll(filters);
  }
}
