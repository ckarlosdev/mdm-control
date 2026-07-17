// export const API_BASE_URL = "http://localhost:8080/api/";

// Production environment
export const API_BASE_URL = "https://api-gateway-px44.onrender.com/api/";

import axios from "axios";
import { useAuthStore } from "../stores/authStore";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. Evitar bucle infinito si el error viene del propio endpoint de refresh
    if (originalRequest.url?.includes("/api/auth/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { refreshToken, login, logout } = useAuthStore.getState();

      if (!refreshToken) {
        logout();
        // Considera usar un navigate de react-router si es posible
        window.location.href = "https://ckarlosdev.github.io/login/";
        return Promise.reject(error);
      }

      try {
        // 2. Usar axios limpio para evitar que otros interceptores interfieran
        const res = await axios.post(
          "https://api-gateway-px44.onrender.com/api/auth/refresh",
          { refreshToken: refreshToken }, // Verifica que el nombre de la propiedad sea correcto
          { headers: { "Content-Type": "application/json" } },
        );

        // 3. Verifica la estructura de res.data.
        // Si tu API devuelve { accessToken, refreshToken }, asegúrate de mapearlos bien.
        const { token: newToken, refreshToken: newRefresh } = res.data;

        if (!newToken) throw new Error("No token received");

        login(newToken, newRefresh || refreshToken); // Mantener el viejo si no llega uno nuevo

        // 4. Actualizar el header del request original
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        logout();

        // Solo redirigir si realmente falló el refresh por token inválido
        console.error("Refresh token expired or invalid", refreshError);
        window.location.href = "https://ckarlosdev.github.io/login/";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
