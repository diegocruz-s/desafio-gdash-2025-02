import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WeatherSnapshot } from 'src/domain/weather/entity/weatherSnapshot';
import { IWeatherSnapshotRepository } from 'src/domain/weather/repositories/WeatherSnapshot';
import { WeatherSnapshotMapper } from '../mappers/WeatherSnapshotMapper';
import {
  WeatherSnapshotDocument,
  WeatherSnapshotMongo,
} from '../schemas/weatherSnapshot.schema';

@Injectable()
export class WeatherMongoRepository implements IWeatherSnapshotRepository {
  constructor(
    @InjectModel(WeatherSnapshotMongo.name)
    private weatherSnapshotModel: Model<WeatherSnapshotDocument>,
  ) {}

  async create(snapshot: WeatherSnapshot): Promise<void> {
    const persistance = WeatherSnapshotMapper.toPersistance(snapshot);
    await this.weatherSnapshotModel.create(persistance);
  }

  async findAll(): Promise<WeatherSnapshot[]> {
    const weatherSnapshots = await this.weatherSnapshotModel.find().exec();

    return weatherSnapshots.map((wtSp) => WeatherSnapshotMapper.toDomain(wtSp));
  }

  async findById(id: string): Promise<WeatherSnapshot | null> {
    const weatherSnapshot = await this.weatherSnapshotModel.findById(id).exec();
    if (!weatherSnapshot) return null;

    return WeatherSnapshotMapper.toDomain(weatherSnapshot);
  }

  async findLatest(): Promise<WeatherSnapshot | null> {
    const weatherSnapshot = await this.weatherSnapshotModel
      .findOne()
      .sort({
        collectedAt: -1,
      })
      .exec();
    if (!weatherSnapshot) return null;

    return WeatherSnapshotMapper.toDomain(weatherSnapshot);
  }
}
