import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error("API ERROR COMPLETO:", error);

    if (!error.response) {
      return Promise.reject({
        status: 0,
        message:
          "No se pudo conectar con el servidor. Verifica que el backend esté encendido en http://localhost:8080 y que CORS permita el frontend.",
        original: error,
      });
    }

    const originalRequest = error.config;
    const data = error.response.data;

    // Handle token refresh on 401
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const response = await apiClient.post("/auth/refresh", {
            refreshToken,
          });

          const newAccessToken = response.data.accessToken;
          localStorage.setItem("accessToken", newAccessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);

          apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);

          return apiClient(originalRequest);
        } catch (err) {
          processQueue(err, null);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      } else {
        isRefreshing = false;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    let message = "No pudimos completar la solicitud. Inténtalo nuevamente.";

    if (typeof data === "string") {
      message = data;
    } else if (data?.message) {
      message = data.message;
    } else if (data?.error) {
      message = data.error;
    } else if (data?.detail) {
      message = data.detail;
    }

    return Promise.reject({
      status: error.response.status,
      message,
      data,
      original: error,
    });
  }
);

export default apiClient;
