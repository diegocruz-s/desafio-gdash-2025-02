import { Transform, TransformCallback } from 'stream';
import { WeatherSnapshot } from '../entity/weatherSnapshot';
import { IWeatherSnapshotRepository } from '../repositories/WeatherSnapshot';
import { Injectable } from '@nestjs/common';

interface CreateWeatherSnapshotInput {
  temperature: number;
  windSpeed: number;
  collectedAt: Date;
  humidity: number;
  city?: string;
  source?: string;
}

export interface IWeatherSnapshotServiceResponse<T> {
  result?: T;
  errors?: string[];
}

@Injectable()
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

  async getAllSnapshots(params: {
    page: number;
  }): Promise<IWeatherSnapshotServiceResponse<WeatherSnapshot[]>> {
    const weatherSnapshots = await this.weatherSnapshotRepository.findAll({
      page: params.page,
    });

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

  exportAsCSVStream() {
    const dbStream = this.weatherSnapshotRepository.streamAll();
    let isheadersCSV = false;

    const csvTransform = new Transform({
      objectMode: true,
      transform(
        chunk: WeatherSnapshot,
        _: BufferEncoding,
        cb: TransformCallback,
      ) {
        console.log('chunk: ', chunk);
        const line = [
          chunk.id,
          chunk.temperature,
          chunk.windSpeed,
          chunk.humidity,
          chunk.city ?? '',
          chunk.source ?? '',
          chunk.collectedAt.toISOString(),
          chunk.createdAt.toISOString(),
        ].join(',');

        if (!isheadersCSV) {
          const headersFormatted = [
            'id',
            'temperature',
            'windSpeed',
            'humidity',
            'city',
            'source',
            'collectedAt',
            'createdAt',
          ].join(',');
          const headersAndLine = [headersFormatted, line].join('\n');
          isheadersCSV = true;
          return cb(null, `${headersAndLine}\n`);
        }

        return cb(null, `${line}\n`);
      },
    });

    return dbStream.pipe(csvTransform);
  }
}
