import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DisposalDocument = Disposal & Document;

@Schema({ timestamps: true })
export class Disposal {
  @Prop({ required: true })
  userName: string;

  @Prop({ type: Types.ObjectId, ref: 'Point', required: true })
  pointId: Types.ObjectId;

  @Prop({ required: true, enum: ['plástico','papel','orgânico','eletrônico','vidro','outro'] })
  wasteType: string;

  @Prop({ type: Date, default: () => new Date() })
  date: Date;
}

export const DisposalSchema = SchemaFactory.createForClass(Disposal);

DisposalSchema.index({ date: 1 });
DisposalSchema.index({ pointId: 1 });
