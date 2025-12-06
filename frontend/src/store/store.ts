import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import userSlice from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;