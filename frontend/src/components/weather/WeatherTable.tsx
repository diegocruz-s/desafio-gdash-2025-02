import React from "react";

type WeatherRecord = {
  id: string;
  collectedAt: string;
  city: string;
  condition: string;
  temperature: number;
  humidity: number;
};

type TableProps = {
  records: WeatherRecord[];
};

const WeatherTable: React.FC<TableProps> = ({ records }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-white text-center text-xl font-semibold mb-4">Registros de Clima</h2>
      <table className="min-w-full table-auto text-white">
        <thead>
          <tr>
            <th className="px-4 py-2">Data/Hora</th>
            <th className="px-4 py-2">Local</th>
            <th className="px-4 py-2">Condição</th>
            <th className="px-4 py-2">Temperatura</th>
            <th className="px-4 py-2">Umidade</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="text-center border-t border-gray-700">
              <td className="px-4 py-2">{record.collectedAt}</td>
              <td className="px-4 py-2">{record.city}</td>
              <td className="px-4 py-2">{record.condition}</td>
              <td className="px-4 py-2">{record.temperature}°C</td>
              <td className="px-4 py-2">{record.humidity}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeatherTable;
