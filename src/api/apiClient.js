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

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR COMPLETO:", error);

    if (!error.response) {
      return Promise.reject({
        status: 0,
        message:
          "No se pudo conectar con el servidor. Verifica que el backend esté encendido en http://localhost:8080 y que CORS permita el frontend.",
        original: error,
      });
    }

    const data = error.response.data;

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