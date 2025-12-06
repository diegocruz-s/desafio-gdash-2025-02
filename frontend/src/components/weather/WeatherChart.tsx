import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

type ChartProps = {
  data: { time: string; temperature: number }[];
};

const WeatherChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-white text-lg font-semibold mb-4">Temperatura ao Longo do Tempo</h3>
      <LineChart width={500} height={300} data={data}>
        <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
      </LineChart>
    </div>
  );
};

export default WeatherChart;
