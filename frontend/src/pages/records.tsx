import React, { useEffect, useState } from "react";
import WeatherTable from "../components/weather/WeatherTable";
import { Button } from "@/components/ui/button";

type WeatherRecord = {
  id: string;
  collectedAt: string;
  city: string;
  condition: string;
  temperature: number;
  humidity: number;
};

const Records: React.FC = () => {
  const [records, setRecords] = useState<WeatherRecord[]>([]);

  useEffect(() => {
    const fetchedRecords: WeatherRecord[] = [
      {
        id: "1",
        collectedAt: "06/12/2025 14:00",
        city: "São Paulo",
        condition: "Ensolarado",
        temperature: 25,
        humidity: 60,
      },
      {
        id: "2",
        collectedAt: "06/12/2025 13:00",
        city: "São Paulo",
        condition: "Nublado",
        temperature: 22,
        humidity: 65,
      },
    ];

    setRecords(fetchedRecords);
  }, []);

  return (
    <div className="p-8">
      {/* <h1 className="text-3xl font-bold mb-6">Registros de Clima</h1> */}
      <WeatherTable records={records} />
      <div className="flex gap-2 w-full">
        <Button variant="secondary" className="mt-4 w-1/2">
          Exportar CSV
        </Button>
        <Button variant="secondary" className="mt-4 w-1/2">
          Exportar XLSX
        </Button>
      </div>
    </div>
  );
};

export default Records;
