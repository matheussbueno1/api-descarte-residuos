// src/report/report.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Disposal, DisposalDocument } from '../disposals/schemas/disposal.schema';
import { Point, PointDocument } from '../points/schemas/point.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Disposal.name) private disposalModel: Model<DisposalDocument>,
    @InjectModel(Point.name) private pointModel: Model<PointDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getReport() {
    const now = new Date();
    const startLast30 = new Date(now);
    startLast30.setDate(now.getDate() - 29); // window de 30 dias
    startLast30.setHours(0, 0, 0, 0);

    const startPrev30 = new Date(startLast30);
    startPrev30.setDate(startLast30.getDate() - 30);
    startPrev30.setHours(0, 0, 0, 0);

    // 1) ponto com maior número de registros
    const topPointAgg = await this.disposalModel.aggregate([
      { $group: { _id: '$pointId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'points',
          localField: '_id',
          foreignField: '_id',
          as: 'point',
        },
      },
      { $unwind: { path: '$point', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          count: 1,
          point: {
            _id: '$point._id',
            name: '$point.name',
            neighborhood: '$point.neighborhood',
            address: '$point.address',
            location: '$point.location',
          },
        },
      },
    ]).exec();

    const topPoint = topPointAgg[0] || null;

    // 2) tipo de resíduo mais frequente
    const topWasteAgg = await this.disposalModel.aggregate([
      { $group: { _id: '$wasteType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]).exec();
    const topWaste = topWasteAgg[0]?._id ?? null;

    // 3) média de descartes por dia nos últimos 30 dias
    const last30TotalAgg = await this.disposalModel.aggregate([
      { $match: { date: { $gte: startLast30, $lte: now } } },
      { $count: 'total' },
    ]).exec();
    const last30Total = last30TotalAgg[0]?.total ?? 0;
    const avgPerDay30 = +(last30Total / 30).toFixed(2);

    // 4) número total de usuários
    const totalUsers = await this.userModel.countDocuments().exec();

    // 5) total de pontos cadastrados
    const totalPoints = await this.pointModel.countDocuments().exec();

    // 6) percentual de crescimento/redução comparado ao período anterior (30 dias anteriores)
    const prev30TotalAgg = await this.disposalModel.aggregate([
      { $match: { date: { $gte: startPrev30, $lt: startLast30 } } },
      { $count: 'total' },
    ]).exec();
    const prev30Total = prev30TotalAgg[0]?.total ?? 0;

    // percent change: (last30 - prev30)/prev30 * 100. Handle prev30=0.
    let percentChange: number | null = null;
    if (prev30Total === 0 && last30Total === 0) {
      percentChange = 0;
    } else if (prev30Total === 0 && last30Total > 0) {
      percentChange = 100; // convenção: de 0 para >0 = 100% (você pode ajustar)
    } else {
      percentChange = +(((last30Total - prev30Total) / prev30Total) * 100).toFixed(2);
    }

    return {
      topPoint,
      topWaste,
      avgPerDay30,
      totalUsers,
      totalPoints,
      last30Total,
      prev30Total,
      percentChange,
    };
  }
}
