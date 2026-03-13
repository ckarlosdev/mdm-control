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
  //   "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJST0xFX0FETUlOIl0sInN1YiI6ImNyYW1pcmV6QGhtYnJhbmR0LmNvbSIsImlhdCI6MTc3MzQxOTk4MCwiZXhwIjoxNzczNDIwODgwfQ.Lk9JyJzv6Gh3Hyqe-wv37GNQiv7XUz6PBc43J1iabAI",
  // refreshToken:
  //   "a8e3bef6-9584-432c-a923-6931707b269e.b9b6d6df-a9c9-4b44-9938-f9c254f8c327",
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
