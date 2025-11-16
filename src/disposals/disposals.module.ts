import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DisposalsService } from './disposals.service';
import { DisposalsController } from './disposals.controller';
import { Disposal, DisposalSchema } from './schemas/disposal.schema';
import { Point, PointSchema } from '../points/schemas/point.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Disposal.name, schema: DisposalSchema },
      // caso precise usar Point/User dentro do service, também registre-os aqui
      { name: Point.name, schema: PointSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [DisposalsController],
  providers: [DisposalsService],
  exports: [DisposalsService], // exporte se outros módulos precisarem do service
})
export class DisposalsModule {}
