import Cookies from "js-cookie";
import { create } from "zustand";

import { api } from "@/config/api";
import { useUserStore } from "./useUserStore";

function getStoredToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}

function setStoredToken(token: string | null) {
  if (typeof window === "undefined") return;

  if (token) {
    localStorage.setItem("authToken", token);
    Cookies.set("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return;
  }

  localStorage.removeItem("authToken");
  Cookies.remove("token");
  delete api.defaults.headers.common["Authorization"];
}

interface AuthState {
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  getToken: () => string | null;
  setAuth: (token: string) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, cpf: string) => Promise<void>;
  recover: (email: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: getStoredToken(),
  isLoading: false,
  isAuthenticated: !!getStoredToken(),

  getToken: () => get().token,

  setAuth: (token: string) => {
    set({ token, isAuthenticated: true });
    setStoredToken(token);
    useUserStore.getState().loadUser();
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post("/auth/login", { email, password });
      const token = data?.token ?? null;
      set({ token, isAuthenticated: !!token });
      setStoredToken(token);
      if (token) await useUserStore.getState().loadUser();
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (name, email, password, cpf) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post("/auth/register", { name, email, password, cpf });
      const token = data?.token ?? null;
      set({ token, isAuthenticated: !!token });
      setStoredToken(token);
      if (token) await useUserStore.getState().loadUser();
    } finally {
      set({ isLoading: false });
    }
  },

  recover: async () => Promise.resolve(),

  logout: () => {
    const { clearUser } = useUserStore.getState();
    set({ token: null, isAuthenticated: false });
    clearUser();
    setStoredToken(null);
  },
}));
