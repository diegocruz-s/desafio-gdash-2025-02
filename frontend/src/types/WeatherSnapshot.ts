export interface WeatherSnapshot {
  id: string;
  createdAt: string;
  collectedAt: string;
  humidity: number;
  temperature: number;
  windSpeed: number;
  city: string;
  source: string;
}