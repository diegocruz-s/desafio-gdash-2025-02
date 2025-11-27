import { WeatherSnapshot } from '../entity/weatherSnapshot';

export interface IWeatherSnapshotRepository {
  findById(id: string): Promise<WeatherSnapshot | null>;
  findLatest(): Promise<WeatherSnapshot | null>;
  findAll(): Promise<WeatherSnapshot[]>;
  create(snapshot: WeatherSnapshot): Promise<void>;
}
