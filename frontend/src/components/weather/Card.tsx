
import React from "react";
import { Card } from "../ui/card";

type CardProps = {
  title: string;
  value: string | number;
  unit: string;
};

const WeatherCard: React.FC<CardProps> = ({ title, value, unit }) => {
  return (
    <Card className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-white text-lg font-semibold">{title}</h3>
      <p className="text-white text-3xl mt-2">
        {value} {unit}
      </p>
    </Card>
  );
};

export default WeatherCard;
