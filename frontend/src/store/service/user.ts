import type { ICreatedUser, User } from "@/types/User";
import { api } from "@/utils/api";

export const createUserService = async (datas: ICreatedUser) => {
  try {
    const res = await api
      .post("/user", datas)
      .then((response) => {
        return response.data.user;
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

export const readUserByIdService = async (id: string) => {
  try {
    // await delay(3000);

    const res = await api
      .get(`/user/${id}`)
      .then((response) => {
        return response.data.user;
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

export const deleteUserService = async (id: string) => {
  try {
    // await delay(3000);

    const res = await api
      .delete(`/user/${id}`)
      .then((response) => {
        return response.data.message;
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

export const updateUserService = async (id: string, datas: Partial<User>) => {
  try {
    // await delay(3000);

    const res = await api
      .patch(`/user/${id}`, datas)
      .then((response) => {
        return response.data.user;
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