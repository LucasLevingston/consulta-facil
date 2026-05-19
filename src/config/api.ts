import axios from "axios";
import Cookies from "js-cookie";
import { env } from "@/env";

export const api = axios.create({
   baseURL: env.NEXT_PUBLIC_API_URL || "/api",
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
         // Clear all stored credentials so the middleware redirects on the next navigation.
         // Do NOT use window.location.href here — it aborts in-flight RSC fetches
         // and causes "Failed to fetch RSC payload" errors in Next.js App Router.
         localStorage.removeItem("authToken");
         Cookies.remove("auth_token");
         Cookies.remove("token");
      }
      return Promise.reject(error);
   },
);
