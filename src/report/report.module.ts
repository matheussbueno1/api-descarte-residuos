// src/report/report.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { Disposal, DisposalSchema } from '../disposals/schemas/disposal.schema';
import { Point, PointSchema } from '../points/schemas/point.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Disposal.name, schema: DisposalSchema },
      { name: Point.name, schema: PointSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
