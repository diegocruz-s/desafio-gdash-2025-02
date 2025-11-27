import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WeatherSnapshotDocument = HydratedDocument<WeatherSnapshotMongo>;

@Schema({ collection: 'weather_snapshots' })
export class WeatherSnapshotMongo {
  @Prop({ required: true })
  temperature: number;

  @Prop({ required: true })
  windSpeed: number;

  @Prop({ required: true, index: true })
  collectedAt: Date;

  @Prop({ required: true })
  humidity: number;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: false })
  city?: string;

  @Prop({ required: false })
  source?: string;
}

export const WeatherSnapshotSchema =
  SchemaFactory.createForClass(WeatherSnapshotMongo);
