import { WeatherSnapshot } from 'src/domain/weather/entity/weatherSnapshot';
import {
  WeatherSnapshotDocument,
  WeatherSnapshotMongo,
} from '../schemas/weatherSnapshot.schema';

export class WeatherSnapshotMapper {
  static toDomain(raw: WeatherSnapshotDocument): WeatherSnapshot {
    return WeatherSnapshot.create(
      {
        collectedAt: raw.collectedAt,
        humidity: raw.humidity,
        temperature: raw.temperature,
        windSpeed: raw.windSpeed,
        createdAt: raw.createdAt,
        city: raw.city,
        source: raw.source,
      },
      raw._id.toString(),
    );
  }
  static toPersistance(entity: WeatherSnapshot): Partial<WeatherSnapshotMongo> {
    return {
      temperature: entity.temperature,
      windSpeed: entity.windSpeed,
      humidity: entity.humidity,
      collectedAt: entity.collectedAt,
      city: entity.city,
      source: entity.source,
      createdAt: entity.createdAt,
    };
  }
}
