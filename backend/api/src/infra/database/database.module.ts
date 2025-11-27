import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherMongoRepository } from './mongo/repositories/WeatherMongoRepository';
import {
  WeatherSnapshotMongo,
  WeatherSnapshotSchema,
} from './mongo/schemas/weatherSnapshot.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: WeatherSnapshotMongo.name,
        schema: WeatherSnapshotSchema,
      },
    ]),
  ],
  providers: [WeatherMongoRepository],
  exports: [WeatherMongoRepository],
})
export class DatabaseModule {}
