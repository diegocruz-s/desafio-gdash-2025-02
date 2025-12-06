import React, { useEffect, useState } from "react";
import WeatherCard from "../components/weather/Card";
import WeatherChart from "../components/weather/WeatherChart";

type WeatherData = {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
};

const Dashboard: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchedWeatherData: WeatherData = {
      temperature: 25,
      humidity: 60,
      windSpeed: 15,
      condition: "Ensolarado",
    };

    setWeatherData(fetchedWeatherData);
  }, []);

  const chartData = [
    { time: "12:00", temperature: 24 },
    { time: "13:00", temperature: 25 },
    { time: "14:00", temperature: 26 },
    { time: "15:00", temperature: 25 },
  ];

  return (
    <div className="p-8">
      <h1 className="text-white text-3xl font-bold mb-6">Dashboard de Clima</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {weatherData && (
          <>
            <WeatherCard
              title="Temperatura Atual"
              value={weatherData.temperature}
              unit="°C"
            />
            <WeatherCard
              title="Umidade Atual"
              value={weatherData.humidity}
              unit="%"
            />
            <WeatherCard
              title="Velocidade do Vento"
              value={weatherData.windSpeed}
              unit="km/h"
            />
            <WeatherCard
              title="Condição Climática"
              value={weatherData.condition}
              unit=""
            />
          </>
        )}
      </div>

      <WeatherChart data={chartData} />
    </div>
  );
};

export default Dashboard;
