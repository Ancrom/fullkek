import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { usersApi } from "../api/usersApi";
import type { IUserResLogin } from "../types/UserType";

export interface IAuthStore {
  authStatus:
    | {
        type: "IDLE";
        user: null;
      }
    | {
        type: "LOADING";
        user: null;
      }
    | {
        type: "SUCCESS";
        user: IUserResLogin;
      }
    | {
        type: "ERROR";
        user: null;
      }
    | {
        type: "CHECKING";
        user: IUserResLogin | null;
      };
  login: (dto: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  setLoginStatus: (status: {
    type: "IDLE" | "LOADING" | "SUCCESS" | "ERROR" | "CHECKING";
    user: IUserResLogin | null;
  }) => void;
}

const useAuthStore = create<IAuthStore>()(
  immer((set) => ({
    authStatus: {
      type: "CHECKING",
      user: null,
    },
    login: async (dto) => {
      set((state) => {
        state.authStatus = {
          type: "LOADING",
          user: null,
        };
      });
      try {
        const user = await usersApi.login(dto);
        set((state) => {
          state.authStatus = { type: "SUCCESS", user };
        });
      } catch (error) {
        set((state) => {
          state.authStatus = { type: "ERROR", user: null };
        });
        throw error;
      }
    },
    logout: () => {
      set((state) => {
        state.authStatus = {
          type: "IDLE",
          user: null,
        };
      });
    },
    setLoginStatus: (status) => {
      set((state) => {
        state.authStatus = status as any;
      });
    },
  })),
);

export default useAuthStore;
