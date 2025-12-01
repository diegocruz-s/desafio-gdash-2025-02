import { WeatherSnapshot } from 'src/domain/weather/entity/weatherSnapshot';

export class WeatherSnapshotPresenter {
  static toHTTP(weatherSnapshot: WeatherSnapshot) {
    return {
      id: weatherSnapshot.id,
      createdAt: weatherSnapshot.createdAt,
      collectedAt: weatherSnapshot.collectedAt,
      humidity: weatherSnapshot.humidity,
      temperature: weatherSnapshot.temperature,
      windSpeed: weatherSnapshot.windSpeed,
      city: weatherSnapshot.city,
      source: weatherSnapshot.source,
    };
  }
}
