import React, { useEffect, useState } from "react";

type WeatherInsights = {
  summary: string;
  alerts: string[];
};

const Insights: React.FC = () => {
  const [insights, setInsights] = useState<WeatherInsights | null>(null);

  useEffect(() => {
    const fetchedInsights: WeatherInsights = {
      summary: "Alta chance de chuva nas próximas horas",
      alerts: ["Calor extremo", "Possível tempestade"],
    };

    setInsights(fetchedInsights);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Insights de Clima</h1>
      {insights ? (
        <div>
          <p>{insights.summary}</p>
          <ul className="mt-4">
            {insights.alerts.map((alert, index) => (
              <li key={index} className="bg-red-500 text-white p-2 rounded mb-2">{alert}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Carregando insights...</p>
      )}
    </div>
  );
};

export default Insights;
