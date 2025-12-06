export interface WeatherInsights {
  period: string;
  temperature: {
    average: number;
    trend: 'up' | 'down' | 'stable';
  };
  humidity: { average: number };
  wind: { average: number };
  comfortScore: number;
  classification: string;
  alerts: string[];
  summary: string;
}