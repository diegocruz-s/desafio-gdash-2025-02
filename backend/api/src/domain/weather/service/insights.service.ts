import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { IServiceResponse } from 'src/domain/interfaces/protocols';
import { WeatherInsights } from '../entity/insights';
import { IWeatherSnapshotRepository } from '../repositories/WeatherSnapshot';
import { Cache } from 'cache-manager';

@Injectable()
export class WeatherSnapshotInsightsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly weatherSnapshotRepository: IWeatherSnapshotRepository,
  ) {}

  async execute({
    periodInHours,
  }: {
    periodInHours: number;
  }): Promise<IServiceResponse<WeatherInsights>> {
    const keyCache = `insights:${periodInHours}`;
    const value = await this.cacheManager.get<WeatherInsights>(keyCache);
    if (value) {
      return {
        result: value,
      };
    }

    const now = new Date();
    const since = new Date(now.getTime() - periodInHours * 60 * 60 * 1000);

    const data = await this.weatherSnapshotRepository.findByPeriod(since);

    if (data.length <= 2) {
      return {
        errors: ['Insufficient data to generate insights.'],
      };
    }

    const temperatures = data.map((d) => d.temperature);
    const humidities = data.map((d) => d.humidity);
    const winds = data.map((d) => d.windSpeed);

    const averageTemperatures = this.average(temperatures);
    const averageHumidities = this.average(humidities);
    const averageWinds = this.average(winds);

    const trend = this.calculateTrend(temperatures);

    const alerts = this.generateAlerts(
      averageTemperatures,
      averageHumidities,
      averageWinds,
    );
    const comfortScore = this.comfortScore(
      averageTemperatures,
      averageHumidities,
      averageWinds,
    );
    const classification = this.classifyDay(
      averageTemperatures,
      averageHumidities,
    );
    const summary = this.generateSummary({
      classification,
      humidity: averageHumidities,
      temp: averageTemperatures,
      trend,
    });

    const weatherInsights: WeatherInsights = {
      period: `${periodInHours}h`,
      temperature: {
        average: averageTemperatures,
        trend,
      },
      humidity: {
        average: averageHumidities,
      },
      wind: {
        average: averageWinds,
      },
      alerts,
      comfortScore,
      classification,
      summary,
    };

    await this.cacheManager.set(keyCache, weatherInsights);
    return {
      result: weatherInsights,
    };
  }

  average(values: number[]) {
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  calculateTrend(values: number[]): 'up' | 'down' | 'stable' {
    const half = Math.floor(values.length / 2);
    const first = this.average(values.slice(0, half));
    const last = this.average(values.slice(half));

    if (last > first + 0.5) return 'up';
    if (last < first - 0.5) return 'down';

    return 'stable';
  }

  comfortScore(temp: number, humidity: number, wind: number): number {
    let score = 100;
    if (temp < 22 || temp > 26) score -= 30;
    if (humidity < 40 || humidity > 70) score -= 20;
    if (wind > 20) score -= 10;

    return score;
  }

  classifyDay(temp: number, humidity: number): string {
    if (temp < 15) return 'Frio';
    if (temp < 26) return 'Agradável';
    if (temp < 30 && humidity < 70) return 'Quente';
    if (temp > 30 && humidity >= 70) return 'Quente e abafado';

    return 'Muito quente';
  }

  generateAlerts(temp: number, humidity: number, wind: number): string[] {
    const alerts: string[] = [];
    if (temp > 36) alerts.push('Calor extremo');
    if (humidity > 90) alerts.push('Umidade excessiva');
    if (wind > 40) alerts.push('Ventos fortes');

    return alerts;
  }

  generateSummary(data: {
    temp: number;
    humidity: number;
    trend: string;
    classification: string;
  }): string {
    return `Nas últimas horas, a temperatura média foi de
    ${data.temp.toFixed(1)}°C, com umidade em torno de
    ${data.humidity.toFixed(0)}%. O clima está classificado como
    ${data.classification}, com tendência
    ${data.trend === 'up' ? 'de alta' : data.trend === 'down' ? 'de queda' : 'estável'}.`;
  }
}
