// src/api/axios.js
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const MUTATING_METHODS = new Set(["post", "put", "patch", "delete"]);

function readCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// Le jeton CSRF (cookie non-httpOnly posé par le serveur à la connexion) doit être
// renvoyé en en-tête sur toute requête qui modifie des données, en plus du cookie
// de session httpOnly envoyé automatiquement par le navigateur.
api.interceptors.request.use((config) => {
  if (MUTATING_METHODS.has((config.method || "").toLowerCase())) {
    const csrfToken = readCookie("snrc_csrf");
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.DEV) {
      console.error("Erreur API SNRC :", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });
    }

    const status = error.response?.status;
    const pathname = window.location.pathname;

    if (
      status === 401 &&
      pathname.startsWith("/admin") &&
      pathname !== "/admin/login"
    ) {
      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);

export default api;