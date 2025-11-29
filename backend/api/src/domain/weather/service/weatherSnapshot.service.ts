import { Injectable } from '@nestjs/common';
import { Readable, Transform, TransformCallback } from 'stream';
import { IServiceResponse } from '../../interfaces/protocols';
import { IConvertDataToXlsx } from '../convertToXlsx/ConvertDataToXlsx';
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

@Injectable()
export class WeatherSnapshotService {
  constructor(
    private readonly weatherSnapshotRepository: IWeatherSnapshotRepository,
    private readonly convertDataToXlsx: IConvertDataToXlsx,
  ) {}

  async create(
    input: CreateWeatherSnapshotInput,
  ): Promise<IServiceResponse<WeatherSnapshot>> {
    const weatherSnapshot = WeatherSnapshot.create(input);

    await this.weatherSnapshotRepository.create(weatherSnapshot);

    return {
      result: weatherSnapshot,
    };
  }

  async getAllSnapshots(params: {
    page: number;
  }): Promise<IServiceResponse<WeatherSnapshot[]>> {
    const weatherSnapshots = await this.weatherSnapshotRepository.findAll({
      page: params.page,
    });

    return {
      result: weatherSnapshots,
    };
  }

  async getLatestSnapshot(): Promise<IServiceResponse<WeatherSnapshot>> {
    const weatherSnapshot = await this.weatherSnapshotRepository.findLatest();

    if (!weatherSnapshot) {
      return {
        errors: ['Weather snapshot not found!'],
      };
    }

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

  exportAsXlsxStream(): Readable {
    const dbStream = this.weatherSnapshotRepository.streamAll();
    const streamXlsx = this.convertDataToXlsx.convert(dbStream);
    return streamXlsx;
  }
}
