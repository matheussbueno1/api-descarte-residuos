// src/points/schemas/point.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PointDocument = Point & Document;

@Schema({ timestamps: true })
export class Point {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) neighborhood: string;
  @Prop({ required: true, enum: ['public','private'] }) type: 'public' | 'private';
  @Prop({ type: [String], default: [] }) categories: string[];
  @Prop({ type: Object, default: {} }) address?: any;
  @Prop({
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number] },
  })
  location?: any;
}

export const PointSchema = SchemaFactory.createForClass(Point);
PointSchema.index({ location: '2dsphere' });
