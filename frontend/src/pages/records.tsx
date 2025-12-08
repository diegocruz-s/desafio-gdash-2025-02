import { Loading } from "@/components/loading/loading";
import { Button } from "@/components/ui/button";
import {
  exportWeatherCSV,
  exportWeatherXLSX,
  getWeatherSnapshots,
} from "@/store/slices/weatherSlice";
import { type AppDispatch, useAppSelector } from "@/store/store";
import type { WeatherSnapshot } from "@/types/WeatherSnapshot";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { WeatherTable } from "../components/weather/WeatherTable";

export function Records () {
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState<number>(1);
  const { loading, weatherSnapshots } = useAppSelector((s) => s.weather);
  const [records, setRecords] = useState<WeatherSnapshot[]>([]);

  useEffect(() => {
    dispatch(getWeatherSnapshots({ page }));
  }, [dispatch, page]);

  useEffect(() => {
    if (weatherSnapshots) setRecords(weatherSnapshots);
  }, [weatherSnapshots]);

  return (
    <div className="p-8">
      {loading && !weatherSnapshots && <Loading />}
      <WeatherTable records={records} />
      <div className="w-full text-center text-white mt-4">
        <p>
          Page:
          <Button
            variant="default"
            size="sm"
            onClick={() => setPage((prev) => (prev <= 1 ? 1 : prev - 1))}
            aria-label="Decrementar página"
            className="mx-2 bg-gray-300 text-black hover:bg-white"
          >
            -
          </Button>
          {page}
          <Button
            variant="default"
            size="sm"
            onClick={() => setPage((prev) => prev + 1)}
            aria-label="Incrementar página"
            className="mx-2 bg-gray-300 text-black hover:bg-white"
          >
            +
          </Button>
        </p>
      </div>
      <div className="flex gap-2 w-full">
        <Button
          variant="secondary"
          className="mt-4 w-1/2"
          onClick={() => {
            if (!loading) dispatch(exportWeatherCSV());
          }}
        >
          Exportar CSV
        </Button>
        <Button
          variant="secondary"
          className="mt-4 w-1/2"
          onClick={() => {
            if (!loading) dispatch(exportWeatherXLSX());
          }}
        >
          Exportar XLSX
        </Button>
      </div>
    </div>
  );
};
