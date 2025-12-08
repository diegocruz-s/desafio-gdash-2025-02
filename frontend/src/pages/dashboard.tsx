import { WeatherChart } from "@/components/weather/WeatherChart";
import {
  getLatestWeather,
  getWeatherSnapshots,
} from "@/store/slices/weatherSlice";
import { useAppSelector, type AppDispatch } from "@/store/store";
import type { WeatherSnapshot } from "@/types/WeatherSnapshot";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import WeatherCard from "../components/weather/Card";
import { Loading } from "@/components/loading/loading";

interface IChartData {
  time: string;
  temperature: number;
  windSpeed: number;
  humidity: number;
}

export function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    loading,
    weatherSnapshot,
    weatherSnapshots,
  } = useAppSelector((s) => s.weather);
  const [weatherData, setWeatherData] = useState<WeatherSnapshot | null>(null);
  const [chartData, setChartData] = useState<IChartData[]>([]);

  useEffect(() => {
    dispatch(getLatestWeather());
    dispatch(getWeatherSnapshots({}));
  }, [dispatch]);

  useEffect(() => {
    setWeatherData(weatherSnapshot);
  }, [weatherSnapshot]);

  useEffect(() => {
    const charts: IChartData[] = [];
    weatherSnapshots?.map((wS) => {
      const dateObject = new Date(wS.collectedAt);
      const hours = String(dateObject.getUTCHours()).padStart(2, "0");
      const minutes = String(dateObject.getUTCMinutes()).padStart(2, "0");
      const formattedTime = `${hours}:${minutes}`;

      charts.push({
        temperature: wS.temperature,
        windSpeed: wS.windSpeed,
        humidity: wS.humidity,
        time: formattedTime,
      });
    });

    setChartData(charts);
  }, [weatherSnapshots]);

  // const chartData = [
  //   { time: "12:00", temperature: 24 },
  //   { time: "13:00", temperature: 25 },
  //   { time: "14:00", temperature: 26 },
  //   { time: "15:00", temperature: 25 },
  // ];

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
              value={weatherData.conditional || ""}
              unit=""
            />
          </>
        )}
      </div>

      { loading && <Loading />}

      {chartData?.length > 0 && (
        <>
          <WeatherChart
            data={chartData}
            dataKey="temperature"
            title="Temperatura ao longo do tempo"
          />
          <WeatherChart
            data={chartData}
            dataKey="humidity"
            title="Humidade ao longo do tempo"
          />
          <WeatherChart
            data={chartData}
            dataKey="windSpeed"
            title="Vento ao longo do tempo"
          />
        </>
      )}
    </div>
  );
};

