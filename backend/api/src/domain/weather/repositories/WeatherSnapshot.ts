import { Readable } from 'stream';
import { WeatherSnapshot } from '../entity/weatherSnapshot';

export abstract class IWeatherSnapshotRepository {
  abstract findById(id: string): Promise<WeatherSnapshot | null>;
  abstract findLatest(): Promise<WeatherSnapshot | null>;
  abstract findAll(params: { page: number }): Promise<WeatherSnapshot[]>;
  abstract create(snapshot: WeatherSnapshot): Promise<void>;
  abstract findByPeriod(since: Date): Promise<WeatherSnapshot[]>;
  abstract streamAll(): Readable;
}
