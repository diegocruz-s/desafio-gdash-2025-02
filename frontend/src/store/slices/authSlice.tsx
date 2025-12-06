import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginService, logoutService } from '../service/auth';
import { api } from '@/utils/api';
import type { IReturnErrorFromAPI } from '@/types/ReturnErrorAPI';

export interface IAuth {
  email: string;
  password: string;
};

export interface IDatasStorage {
  accessToken: string;
  id: string;
};

const datasUser: IDatasStorage = JSON.parse(localStorage.getItem('datasStorage') || '{}');

export interface IInitialStates {
  errors: string[] | null;
  success: string | null;
  loading: boolean;
  datasStorage: IDatasStorage | null;
}

const initialStates: IInitialStates = {
  errors: null,
  loading: false,
  success: null,
  datasStorage: datasUser,
}

export const login = createAsyncThunk(
  'auth/signin',
  async (datas: IAuth, thunkAPI) => {
    resetStates();

    if (!datas) return;

    const res: IDatasStorage = await loginService(datas);
    if ('error' in res) return thunkAPI.rejectWithValue(res);
    console.log('res: ', res);

    api.defaults.headers.authorization = `Bearer ${res.accessToken}`;
    return res;
  }
)

export const logout = createAsyncThunk(
  'user/logout',
  async (_, thunkAPI) => {
      await logoutService()
  }
)

export const authSlice = createSlice({
  name: 'auth',
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
      .addCase(login.rejected, (state, { payload }) => {
        const payloadError = payload as IReturnErrorFromAPI;

        state.errors = payloadError.message;
        state.success = null;
        state.loading = false;
      })
      .addCase(login.pending, (state) => {
        state.errors = null;
        state.success = null;
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        const payloadDatas = payload as IDatasStorage;

        state.errors = null;
        state.loading = false;
        state.datasStorage = payloadDatas;
        localStorage.setItem('datasStorage', JSON.stringify(payloadDatas));
      })

      .addCase(logout.fulfilled, (state, { payload }) => {
        state.errors = null
        state.loading = false
        state.datasStorage = null
    })
  }
});

export const { resetStates } = authSlice.actions;
export default authSlice.reducer;