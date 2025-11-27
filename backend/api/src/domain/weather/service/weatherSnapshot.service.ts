import { WeatherSnapshot } from '../entity/weatherSnapshot';
import { IWeatherSnapshotRepository } from '../repositories/WeatherSnapshot';

interface CreateWeatherSnapshotInput {
  temperature: number;
  windSpeed: number;
  collectedAt: Date;
  humidity: number;
  city?: string;
  source?: string;
}

interface IWeatherSnapshotServiceResponse<T> {
  result?: T;
  errors?: string[];
}

export class WeatherSnapshotService {
  constructor(
    private readonly weatherSnapshotRepository: IWeatherSnapshotRepository,
  ) {}

  async create(
    input: CreateWeatherSnapshotInput,
  ): Promise<IWeatherSnapshotServiceResponse<WeatherSnapshot>> {
    const weatherSnapshot = WeatherSnapshot.create(input);

    await this.weatherSnapshotRepository.create(weatherSnapshot);

    return {
      result: weatherSnapshot,
    };
  }

  async getAllSnapshots(): Promise<
    IWeatherSnapshotServiceResponse<WeatherSnapshot[]>
  > {
    const weatherSnapshots = await this.weatherSnapshotRepository.findAll();

    return {
      result: weatherSnapshots,
    };
  }

  async getLatestSnapshot(): Promise<
    IWeatherSnapshotServiceResponse<WeatherSnapshot | null>
  > {
    const weatherSnapshot = await this.weatherSnapshotRepository.findLatest();

    return {
      result: weatherSnapshot,
    };
  }
}
