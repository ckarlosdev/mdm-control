import { create } from "zustand";
import type { authUser } from "../types";

interface AuthState {
  token: string | null;
  refreshToken?: string | null;
  isAuthenticated: boolean;
  activeModule: string;
  user: authUser | null;
  showModal: boolean;
  typeData: string;
  modalText: string;
  setModalText: (type: string) => void;
  setTypeData: (type: string) => void;
  setShowModal: (show: boolean) => void;
  setActiveModule: (module: string) => void;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  setUser: (user: authUser | null) => void;
  clearAuth: () => void;
}

const storedToken = localStorage.getItem("auth_token");
const storedRefreshToken = localStorage.getItem("refresh_token");

export const useAuthStore = create<AuthState>((set) => ({
  token: storedToken,
  refreshToken: storedRefreshToken,
  isAuthenticated: !!storedToken,

  // token:
  //   "",
  // refreshToken:
  //   "",
  // isAuthenticated: true,

  activeModule: "Home",
  user: null,
  showModal: false,
  typeData: "Error",
  modalText: "Mensaje",

  setModalText: (text) => set({ modalText: text }),
  setTypeData: (type) => set({ typeData: type }),
  setActiveModule: (module: string) => set({ activeModule: module }),

  login: (token: string, refreshToken: string) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("refresh_token", refreshToken);
    set({ token, refreshToken, isAuthenticated: true });
  },

  setShowModal: (show) => set({ showModal: show }),

  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    set({
      token: null,
      isAuthenticated: false,
      user: null,
      refreshToken: null,
    });
  },

  setUser: (user) => set({ user }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
}));
