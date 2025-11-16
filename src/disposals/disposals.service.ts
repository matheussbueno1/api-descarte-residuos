// src/disposals/disposals.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Disposal, DisposalDocument } from './schemas/disposal.schema';
import { CreateDisposalDto } from './dto/create-disposal.dto';

@Injectable()
export class DisposalsService {
  constructor(
    @InjectModel(Disposal.name) private disposalModel: Model<DisposalDocument>,
  ) {}

  async create(dto: CreateDisposalDto) {
    const doc = await this.disposalModel.create({
      userName: dto.userName,
      pointId: dto.pointId ? new Types.ObjectId(dto.pointId) : undefined,
      wasteType: dto.wasteType,
      date: dto.date ? new Date(dto.date) : new Date(),
    });
    return doc.toObject();
  }

  /**
   * Busca descartes com filtros opcionais:
   * filters pode conter: pointId, wasteType, userName, from, to
   * - from/to: strings ISO (yyyy-mm-dd ou ISO) ou Date
   */
  async findAll(query: any = {}) {
    const filters: any = {};

    if (query.pointId) {
      try {
        filters.pointId = new Types.ObjectId(query.pointId);
      } catch (e) {
        // se não for ObjectId válido, busca nada (ou poderíamos ignorar)
        filters.pointId = query.pointId;
      }
    }

    if (query.wasteType) filters.wasteType = query.wasteType;
    if (query.userName) filters.userName = query.userName;

    // suporte para range de datas: from / to ou date
    if (query.from || query.to) {
      filters.date = {};
      if (query.from) filters.date.$gte = new Date(query.from);
      if (query.to) filters.date.$lte = new Date(query.to);
    } else if (query.date) {
      // filtrar por dia específico (date no formato yyyy-mm-dd)
      const d = new Date(query.date);
      const start = new Date(d);
      start.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      filters.date = { $gte: start, $lte: end };
    }

    const docs = await this.disposalModel
      .find(filters)
      .sort({ date: -1 })
      .lean()
      .exec();

    return docs;
  }

  // opcional: método para buscar por id
  async findById(id: string) {
    return this.disposalModel.findById(id).lean().exec();
  }
}
