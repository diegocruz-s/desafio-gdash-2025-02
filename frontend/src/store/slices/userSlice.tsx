import type { IReturnErrorFromAPI } from "@/types/ReturnErrorAPI";
import type { ICreatedUser, User } from "@/types/User";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserService,
  deleteUserService,
  readUserByIdService,
  updateUserService,
} from "../service/user";

export interface IInitialStates {
  errors: string[] | null;
  success: string | null;
  loading: boolean;
  user: User | null;
}

const initialStates: IInitialStates = {
  errors: null,
  loading: false,
  success: null,
  user: null,
};

export const createUser = createAsyncThunk(
  "user/create",
  async (datas: ICreatedUser, thunkAPI) => {
    resetStates();

    if (!datas) return;

    const res: User = await createUserService(datas);
    console.log("res: ", res);
    if ("error" in res) return thunkAPI.rejectWithValue(res);

    return res;
  }
);

export const readUserById = createAsyncThunk(
  "user/readById",
  async (userId: string, thunkAPI) => {
    resetStates();

    if (!userId) return thunkAPI.rejectWithValue("ID not provided");

    const res: User = await readUserByIdService(userId);
    console.log("res: ", res);
    if ("error" in res) return thunkAPI.rejectWithValue(res);

    return res;
  }
);

export const updateUser = createAsyncThunk(
  "user/update",
  async (
    { userId, datas }: { userId: string; datas: Partial<ICreatedUser> },
    thunkAPI
  ) => {
    resetStates();

    if (!userId) return thunkAPI.rejectWithValue("ID not provided");

    const res: User = await updateUserService(userId, datas);
    console.log("res: ", res);
    if ("error" in res) return thunkAPI.rejectWithValue(res);

    return res;
  }
);

export const deleteUser = createAsyncThunk(
  "user/delete",
  async (userId: string, thunkAPI) => {
    resetStates();

    if (!userId) return thunkAPI.rejectWithValue("ID not provided");

    const res = await deleteUserService(userId);
    console.log("res: ", res);
    if (res?.error) return thunkAPI.rejectWithValue(res);

    return res;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: initialStates,
  reducers: {
    resetStates(states) {
      states.errors = null;
      states.loading = false;
      states.success = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createUser.rejected, (state, { payload }) => {
        console.log("payload: ", payload);
        const payloadError = payload as IReturnErrorFromAPI;

        state.errors = payloadError.message;
        state.success = null;
        state.loading = false;
      })
      .addCase(createUser.pending, (state) => {
        state.errors = null;
        state.success = null;
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, { payload }) => {
        console.log("payload: ", payload);
        const payloadDatas = payload as User;

        state.errors = null;
        state.loading = false;
        state.success = "User created with success!";
        state.user = payloadDatas;
      })

      .addCase(readUserById.rejected, (state, { payload }) => {
        console.log("payload: ", payload);
        const payloadError = payload as IReturnErrorFromAPI;

        state.errors = payloadError.message;
        state.success = null;
        state.loading = false;
      })
      .addCase(readUserById.pending, (state) => {
        state.errors = null;
        state.success = null;
        state.loading = true;
      })
      .addCase(readUserById.fulfilled, (state, { payload }) => {
        console.log("payload: ", payload);
        const payloadDatas = payload as User;

        state.errors = null;
        state.loading = false;
        state.user = payloadDatas;
      })

      .addCase(updateUser.rejected, (state, { payload }) => {
        console.log("payload: ", payload);
        const payloadError = payload as IReturnErrorFromAPI;

        state.errors = payloadError.message;
        state.success = null;
        state.loading = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.errors = null;
        state.success = null;
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        console.log("payload: ", payload);
        const payloadDatas = payload as User;

        state.errors = null;
        state.loading = false;
        state.success = "User updated with success!";
        state.user = payloadDatas;
      })

      .addCase(deleteUser.rejected, (state, { payload }) => {
        console.log("payloadError: ", payload);
        const payloadError = payload as IReturnErrorFromAPI;

        state.errors = payloadError.message;
        state.loading = false;
        state.success = null;
      })
      .addCase(deleteUser.pending, (state) => {
        state.errors = null;
        state.loading = true;
        state.success = null;
      })
      .addCase(deleteUser.fulfilled, (state, { payload }) => {
        console.log("payload: ", payload);
        const payloadDatas = payload as unknown as string;

        state.errors = null;
        state.loading = false;
        state.success = payloadDatas;
        state.user = null;
      });
  },
});

export const { resetStates } = userSlice.actions;
export default userSlice.reducer;
