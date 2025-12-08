import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { downloadCSVService, downloadXLSXService, getLatestWeatherService, getWeatherInsightsService, getWeatherSnapshotsService } from '../service/weather';
import type { IReturnErrorFromAPI } from '@/types/ReturnErrorAPI';
import type { WeatherSnapshot } from '@/types/WeatherSnapshot';
import type { WeatherInsights } from '@/types/Insights';

export interface IInitialStates {
  errors: string[] | null;
  success: string | null;
  loading: boolean;
  weatherSnapshot: WeatherSnapshot | null;
  weatherSnapshots: WeatherSnapshot[] | null;
  insights: WeatherInsights | null;
}

const initialStates: IInitialStates = {
  errors: null,
  loading: false,
  success: null,
  weatherSnapshot: null,
  weatherSnapshots: null,
  insights: null,
};

export const getLatestWeather = createAsyncThunk(
  'weather/getLatest',
  async (_, thunkAPI) => {
    resetStates();

    const res: WeatherSnapshot = await getLatestWeatherService();
    if ('error' in res) return thunkAPI.rejectWithValue(res);

    return res;
  }
)

export const getWeatherSnapshots = createAsyncThunk(
  'weather/getSnapshots',
  async ({ page }: { page?: number }, thunkAPI) => {
    resetStates();

    const res: WeatherSnapshot = await getWeatherSnapshotsService(page || 1);
    if ('error' in res) return thunkAPI.rejectWithValue(res);

    return res;
  }
)
export const getWeatherInsights = createAsyncThunk(
  'weather/insights',
  async ({ valueInHours }: { valueInHours?: number }, thunkAPI) => {
    resetStates();

    const res: WeatherInsights = await getWeatherInsightsService(valueInHours || 24);
    if ('error' in res) return thunkAPI.rejectWithValue(res);

    return res;
  }
)

export const exportWeatherCSV = createAsyncThunk(
  'weather/exportCSV',
  async (_, thunkAPI) => {
    try {
      await downloadCSVService();
      return 'CSV exportado com sucesso';
    } catch (error) {
      return thunkAPI.rejectWithValue(['Erro ao exportar o arquivo CSV']);
    }
  }
)

export const exportWeatherXLSX = createAsyncThunk(
  'weather/exportXLSX',
  async (_, thunkAPI) => {
    try {
      await downloadXLSXService();
      return 'XLSX exportado com sucesso';
    } catch (error) {
      return thunkAPI.rejectWithValue(['Erro ao exportar o arquivo XLSX']);
    }
  }
)

export const weatherSlice = createSlice({
  name: 'weather',
  initialState: initialStates,
  reducers: {
    resetStates(states) {
      states.errors = null;
      states.loading = false;
      states.success = null;
    },
  },
  extraReducers (builder) {
    builder
      .addCase(getLatestWeather.rejected, (state, { payload }) => {
        const payloadError = payload as IReturnErrorFromAPI;

        state.errors = payloadError.message;
        state.success = null;
        state.loading = false;
      })
      .addCase(getLatestWeather.pending, (state) => {
        state.errors = null;
        state.success = null;
        state.loading = true;
      })
      .addCase(getLatestWeather.fulfilled, (state, { payload }) => {
        const payloadDatas = payload as WeatherSnapshot;

        state.errors = null;
        state.loading = false;
        state.weatherSnapshot = payloadDatas;
      })

      .addCase(getWeatherSnapshots.rejected, (state, { payload }) => {
        const payloadError = payload as IReturnErrorFromAPI;

        state.errors = payloadError.message;
        state.success = null;
        state.loading = false;
      })
      .addCase(getWeatherSnapshots.pending, (state) => {
        state.errors = null;
        state.success = null;
        state.loading = true;
      })
      .addCase(getWeatherSnapshots.fulfilled, (state, { payload }) => {
        const payloadDatas = payload as unknown as WeatherSnapshot[];

        state.errors = null;
        state.loading = false;
        state.weatherSnapshots = payloadDatas;
      })

      .addCase(getWeatherInsights.rejected, (state, { payload }) => {
        const payloadError = payload as IReturnErrorFromAPI;

        state.errors = payloadError.message;
        state.success = null;
        state.loading = false;
      })
      .addCase(getWeatherInsights.pending, (state) => {
        state.errors = null;
        state.success = null;
        state.loading = true;
      })
      .addCase(getWeatherInsights.fulfilled, (state, { payload }) => {
        const payloadDatas = payload as WeatherInsights;

        state.errors = null;
        state.loading = false;
        state.insights = payloadDatas;
      })

      .addCase(exportWeatherCSV.pending, (state) => {
        state.loading = true;
        state.errors = null;
        state.success = null;
      })
      .addCase(exportWeatherCSV.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportWeatherCSV.rejected, (state) => {
        state.loading = false;
      })

      .addCase(exportWeatherXLSX.pending, (state) => {
        state.loading = true;
        state.errors = null;
        state.success = null;
      })
      .addCase(exportWeatherXLSX.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportWeatherXLSX.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const { resetStates } = weatherSlice.actions;
export default weatherSlice.reducer;