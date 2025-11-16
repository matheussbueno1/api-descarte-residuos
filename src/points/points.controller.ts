// src/points/points.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PointsService } from './points.service';
import { CreatePointDto } from './dto/create-point.dto';

@Controller('points')
export class PointsController {
  constructor(private readonly service: PointsService) {}

  @Post()
  create(@Body() dto: CreatePointDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }
}
