// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PointsModule } from './points/points.module';
import { UsersModule } from './users/users.module';
import { DisposalsModule } from './disposals/disposals.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/v3_aula_tarefa'),
    PointsModule,
    UsersModule,
    DisposalsModule,
    ReportModule,
  ],
})
export class AppModule {}
