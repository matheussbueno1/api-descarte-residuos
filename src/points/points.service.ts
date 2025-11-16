// src/points/points.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Point, PointDocument } from './schemas/point.schema';
import { CreatePointDto } from './dto/create-point.dto';

@Injectable()
export class PointsService {
  constructor(@InjectModel(Point.name) private pointModel: Model<PointDocument>) {}

  async create(dto: CreatePointDto) {
    // se location vier como array [lng, lat], converte para GeoJSON
    if (Array.isArray(dto.location) && dto.location.length === 2) {
      dto.location = { type: 'Point', coordinates: dto.location };
    }
    const created = await this.pointModel.create(dto as any);
    return { message: 'Ponto criado com sucesso', id: created._id };
  }

  async findAll() {
    return this.pointModel.find().lean().exec();
  }

  async findById(id: string) {
    return this.pointModel.findById(id).lean().exec();
  }
}
