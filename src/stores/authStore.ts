import { create } from "zustand";
import type { User } from "../types";

interface AuthState {
  token: string | null;
  refreshToken?: string | null;
  isAuthenticated: boolean;
  activeModule: string;
  user: User | null;
  showModal: boolean;
  typeData: string;
  modalText: string;
  setModalText: (type: string) => void;
  setTypeData: (type: string) => void;
  setShowModal: (show: boolean) => void;
  setActiveModule: (module: string) => void;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const storedToken = localStorage.getItem("auth_token");
const storedRefreshToken = localStorage.getItem("refresh_token");

export const useAuthStore = create<AuthState>((set) => ({
  // token: storedToken,
  // refreshToken: storedRefreshToken,
  // isAuthenticated: !!storedToken,

  token:
    "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJST0xFX0FETUlOIl0sInN1YiI6ImNyYW1pcmV6QGhtYnJhbmR0LmNvbSIsImlhdCI6MTc3MzI0NjYwNCwiZXhwIjoxNzczMjQ3NTA0fQ.8aFDDZKVnRQXue3fjUfHzTbDQMxTUhNpWm6jg8ZlwUo",
  refreshToken:
    "861295fb-9cad-4b1d-8496-c0561b3529f4.3030323d-ff98-4ebe-bd9c-2acfbf968089",
  isAuthenticated: true,

  activeModule: "Home",
  user: null,
  showModal: true,
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
}));
