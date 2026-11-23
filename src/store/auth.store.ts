import { create } from "zustand";

import { api } from "@/config/api";
import { getStoredToken, setStoredToken } from "@/lib/utils/token-storage";
import { useUserStore } from "./useUserStore";

interface AuthState {
	token: string | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	error: string | null;
	getToken: () => string | null;
	setAuth: (token: string) => void;
	login: (email: string, password: string) => Promise<void>;
	register: (
		name: string,
		email: string,
		password: string,
		cpf: string,
	) => Promise<void>;
	recover: (email: string) => Promise<void>;
	logout: () => void;
	clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
	token: getStoredToken(),
	isLoading: false,
	isAuthenticated: !!getStoredToken(),
	error: null,

	getToken: () => get().token,

	setAuth: (token: string) => {
		set({ token, isAuthenticated: true });
		setStoredToken(token);
		useUserStore.getState().loadUser();
	},

	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const { data } = await api.post("/auth/login", { email, password });
			const token = data?.token ?? null;
			set({ token, isAuthenticated: !!token });
			setStoredToken(token);
			if (token) await useUserStore.getState().loadUser();
		} catch (e: unknown) {
			set({
				error: e instanceof Error ? e.message : "Erro inesperado",
				isLoading: false,
			});
			throw e;
		} finally {
			set({ isLoading: false });
		}
	},

	register: async (name, email, password, cpf) => {
		set({ isLoading: true, error: null });
		try {
			const { data } = await api.post("/auth/register", {
				name,
				email,
				password,
				cpf,
			});
			const token = data?.token ?? null;
			set({ token, isAuthenticated: !!token });
			setStoredToken(token);
			if (token) await useUserStore.getState().loadUser();
		} catch (e: unknown) {
			set({
				error: e instanceof Error ? e.message : "Erro inesperado",
				isLoading: false,
			});
			throw e;
		} finally {
			set({ isLoading: false });
		}
	},

	recover: async (email) => {
		set({ isLoading: true, error: null });
		try {
			await api.post("/auth/forgot-password", { email });
		} catch (e: unknown) {
			set({
				error: e instanceof Error ? e.message : "Erro inesperado",
				isLoading: false,
			});
			throw e;
		} finally {
			set({ isLoading: false });
		}
	},

	logout: () => {
		const { clearUser } = useUserStore.getState();
		set({ token: null, isAuthenticated: false });
		clearUser();
		setStoredToken(null);
	},

	clearError: () => set({ error: null }),
}));
