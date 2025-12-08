import { api } from "@/utils/api";
import type { IAuth } from "../slices/authSlice";

export const loginService = async (datas: IAuth) => {
  try {
    const res = await api.post('/signin', datas)
      .then(response => {
        return response.data
      })
      .catch((err) => {
        return err.response.data
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

export const logoutService = async () => {
  api.defaults.headers.authorization = ''
  await localStorage.removeItem('datasStorage')
}