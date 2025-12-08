import { Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

type ChartProps = {
  data: {
    time: string;
    temperature?: number;
    humidity?: number;
    windSpeed?: number;
  }[];
  dataKey: 'temperature' | 'humidity' | 'windSpeed',
  title: string;
};

export function WeatherChart({ data, dataKey, title }: ChartProps) {
  const formatYAxisValue = (value: number) => {
    if (dataKey === "temperature") {
      return `${value}°C`;
    } else if (dataKey === "humidity") {
      return `${value}%`;
    } else if (dataKey === "windSpeed") {
      return `${value} km`;
    }
    return String(value);
  };
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-4">
      <h3 className="text-white text-lg font-semibold mb-4">
        {title}
      </h3>
      <LineChart width={500} height={300} data={data}>
        <Line type="monotone" dataKey={dataKey} stroke="#8884d8" />
        <XAxis dataKey="time" />
        <YAxis tickFormatter={formatYAxisValue} />
        <Tooltip />
        <Legend />
      </LineChart>
    </div>
  );
}
