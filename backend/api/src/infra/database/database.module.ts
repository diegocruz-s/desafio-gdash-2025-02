import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherMongoRepository } from './mongo/repositories/WeatherMongoRepository';
import {
  WeatherSnapshotMongo,
  WeatherSnapshotSchema,
} from './mongo/schemas/weatherSnapshot.schema';
import { IWeatherSnapshotRepository } from 'src/domain/weather/repositories/WeatherSnapshot';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: WeatherSnapshotMongo.name,
        schema: WeatherSnapshotSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: IWeatherSnapshotRepository,
      useClass: WeatherMongoRepository,
    },
  ],
  exports: [IWeatherSnapshotRepository],
})
export class DatabaseModule {}
