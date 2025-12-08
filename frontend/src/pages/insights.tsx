import { Card } from "@/components/ui/card";
import { getWeatherInsights } from "@/store/slices/weatherSlice";
import { useAppSelector, type AppDispatch } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  FaTemperatureHigh,
  FaWind,
  FaCloudSun,
  FaArrowUp,
  FaArrowDown,
  FaArrowRight,
} from "react-icons/fa";
import { Loading } from "@/components/loading/loading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Insights() {
  const dispatch = useDispatch<AppDispatch>();
  const [valueInHours, setValueInHours] = useState<number>(24);
  const { loading, insights } = useAppSelector((s) => s.weather);

  useEffect(() => {
    dispatch(getWeatherInsights({ valueInHours }));
  }, [dispatch]);

  const onChangePeriod = async () => {
    await dispatch(getWeatherInsights({ valueInHours }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg mt-5">
      {loading && <Loading />}
      {/* period */}
      <div className="flex flex-col items-center gap-3 mb-6">
        <h2 className="text-3xl font-bold text-white">Período analisado:</h2>

        <div className="flex items-center gap-3">
          <Input
            type="number"
            value={valueInHours}
            onChange={(e) => setValueInHours(Number(e.target.value))}
            className="w-24 p-2 rounded-md bg-gray-700 text-white text-center border border-gray-600"
          />

          <Button
            onClick={onChangePeriod}
            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            <FaArrowRight />
          </Button>
        </div>

        <p className="text-gray-300 text-sm">(Atual: {insights?.period})</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* temperature */}
        <Card className="p-6 bg-blue-50 shadow-lg rounded-lg">
          <div className="flex items-center justify-between">
            <FaTemperatureHigh className="text-4xl text-blue-600" />
            <div className="text-right">
              <h3 className="text-xl font-semibold">
                {insights?.temperature.average}°C
              </h3>
              <div className="text-sm text-gray-500">
                {insights?.temperature.trend === "up" && (
                  <div>
                    <FaArrowUp className="inline text-red-500" />
                    Aquecendo
                  </div>
                )}
                {insights?.temperature.trend === "down" && (
                  <div>
                    <FaArrowDown className="inline text-blue-500" />
                    Esfriando
                  </div>
                )}
                {insights?.temperature.trend === "stable" && (
                  <div>
                    <FaCloudSun className="inline text-yellow-500" />
                    Estável
                  </div>
                )}
              </div>
            </div>
          </div>
          <p className="mt-4 text-gray-600">
            Temperatura média das últimas {insights?.period}.
          </p>
        </Card>

        {/* humidity */}
        <Card className="p-6 bg-green-50 shadow-lg rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Humidade</h3>
            <p className="text-xl font-semibold">
              {insights?.humidity.average}%
            </p>
          </div>
          <p className="mt-4 text-gray-600">
            Umidade média do ar das últimas {insights?.period}.
          </p>
        </Card>

        {/* wind */}
        <Card className="p-6 bg-gray-100 shadow-lg rounded-lg">
          <div className="flex items-center justify-between">
            <FaWind className="text-4xl text-gray-600" />
            <h3 className="text-xl font-semibold">
              {insights?.wind.average} km/h
            </h3>
          </div>
          <p className="mt-4 text-gray-600">
            Velocidade média do vento das últimas {insights?.period}.
          </p>
        </Card>
      </div>

      {/* comfort */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        <Card className="p-6 bg-yellow-50 shadow-lg rounded-lg">
          <h3 className="text-xl font-semibold">Índice de Conforto</h3>
          <p className="text-2xl font-bold mt-2">{insights?.comfortScore}%</p>
          <p className="text-xl text-gray-500 mt-2">
            {insights?.classification}
          </p>
        </Card>

        {/* alerts */}
        <Card className="p-6 bg-red-50 shadow-lg rounded-lg">
          <h3 className="text-xl font-semibold">Alertas</h3>

          {insights?.alerts.length === 0 ? (
            <p className="text-sm font-semibold">Sem alertas no momento!</p>
          ) : (
            <ul className="mt-2 list-disc list-inside text-sm text-gray-500">
              {insights?.alerts.map((alert, index) => (
                <li key={index}>{alert}</li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* summary */}
      <div className="mt-6">
        <Card className="p-6 bg-gray-100 shadow-lg rounded-lg">
          <h3 className="text-xl font-semibold">Resumo</h3>
          <p className="mt-2 text-lg text-gray-600">{insights?.summary}</p>
        </Card>
      </div>
    </div>
  );
}
