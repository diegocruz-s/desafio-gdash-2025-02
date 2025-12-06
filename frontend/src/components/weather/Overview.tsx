import type { WeatherSnapshot } from "@/types/WeatherSnapshot";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";

export function WeatherOverview () {
  const [latest, setLatest] = useState<WeatherSnapshot>();

  useEffect(() => {
    setLatest(
      {
        id: "693237286a7acf9ed6fcea36",
        createdAt: "2025-12-05T01:36:40.973Z",
        collectedAt: "2025-12-04T10:36:00.000Z",
        humidity: 45.3,
        temperature: 39,
        windSpeed: 23,
        city: "Qualquer cidade",
        source: "Qualquer source"
      }
    )
  }, []);

  if (!latest) return <p className="text-white">Carregando dados atuais...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3 text-white">Clima atual</h2>

      <div className="grid grid-cols-4 gap-4 text-white">
        <Card className="p-4 text-lg">🌡 Temperatura: {latest.temperature}°C</Card>
        <Card className="p-4 text-lg">💧 Umidade: {latest.humidity}%</Card>
        <Card className="p-4 text-lg">💨 Vento: {latest.windSpeed} km/h</Card>
        <Card className="p-4 text-lg">🏙 Cidade: {latest.city}</Card>
      </div>
    </div>
  )
}