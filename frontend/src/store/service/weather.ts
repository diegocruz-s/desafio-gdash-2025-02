import { api } from "@/utils/api";

export const getLatestWeatherService = async () => {
  try {
    const res = await api
      .get("/weather/latest")
      .then((response) => {
        return response.data.weatherSnapshot;
      })
      .catch((err) => {
        return err.response.data;
      });

    return res;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return [error.message];
    } else {
      return ["An unknown error occurred."];
    }
  }
};

export const getWeatherSnapshotsService = async (page: number) => {
  try {
    const res = await api
      .get(`/weather/logs?page=${page}`)
      .then((response) => {
        return response.data.weatherSnapshots;
      })
      .catch((err) => {
        return err.response.data;
      });

    return res;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return [error.message];
    } else {
      return ["An unknown error occurred."];
    }
  }
};

export const getWeatherInsightsService = async (valueInHours: number) => {
  try {
    const res = await api
      .get(`/weather/insights?period=${valueInHours}`)
      .then((response) => {
        return response.data.weatherSnapshotsInsights;
      })
      .catch((err) => {
        return err.response.data;
      });

    return res;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return [error.message];
    } else {
      return ["An unknown error occurred."];
    }
  }
};

export const downloadCSVService = async () => {
  api.get('/weather/export.csv', { responseType: 'blob' })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));

      const a = document.createElement('a');
      a.href = url;
      a.download = 'weather.csv';
      a.click();

      window.URL.revokeObjectURL(url);
    })
    .catch((error: Error) => {
      console.error('Erro ao fazer o download do arquivo CSV:', error);
    });
}

export const downloadXLSXService = async () => {
  api.get('/weather/export.xlsx', { responseType: 'blob' })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));

      const a = document.createElement('a');
      a.href = url;
      a.download = 'weather.xlsx';
      a.click();

      window.URL.revokeObjectURL(url);
    })
    .catch((error: Error) => {
      console.error('Erro ao fazer o download do arquivo XLSX:', error);
    });
}