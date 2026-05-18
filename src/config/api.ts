import axios from "axios";

export const api = axios.create({
   baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
});

api.interceptors.request.use(
   (config) => {
      const token =
         typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
   },
   (error) => {
      return Promise.reject(error);
   },
);

api.interceptors.response.use(
   (response) => response,
   (error) => {
      if (typeof window !== "undefined" && error.response?.status === 401) {
         localStorage.removeItem("authToken");
         window.location.href = "/auth/login";
      }
      return Promise.reject(error);
   },
);