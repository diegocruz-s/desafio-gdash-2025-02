import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherMongoRepository } from './mongo/repositories/WeatherMongoRepository';
import {
  WeatherSnapshotMongo,
  WeatherSnapshotSchema,
} from './mongo/schemas/weatherSnapshot.schema';
import { IWeatherSnapshotRepository } from 'src/domain/weather/repositories/WeatherSnapshot';
import { IUserRepository } from 'src/domain/user/repository/UsersRepository';
import { UserRepository } from './mongo/repositories/UserRepository';
import { UserMongo, UserSchema } from './mongo/schemas/user.schema';
import { SeedService } from './mongo/seeder/seeder.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: WeatherSnapshotMongo.name,
        schema: WeatherSnapshotSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: UserMongo.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: IWeatherSnapshotRepository,
      useClass: WeatherMongoRepository,
    },
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    SeedService,
  ],
  exports: [IWeatherSnapshotRepository, IUserRepository],
})
export class DatabaseModule {}
