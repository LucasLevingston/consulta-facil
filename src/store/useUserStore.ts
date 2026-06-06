import { create } from "zustand";
import { api } from "@/config/api";
import type { UserResponse } from "@/lib/schemas/auth/user-response.schema";

function getErrorStatus(error: unknown) {
	if (typeof error === "object" && error !== null && "response" in error) {
		const response = (error as { response?: { status?: number } }).response;
		return response?.status;
	}

	return undefined;
}

interface UserStore {
	user: UserResponse | null;
	token: string | null;
	isLoading: boolean;
	getToken: () => string | null;
	loadUser: () => Promise<void>;
	clearUser: () => void;
}

function getStoredToken() {
	if (typeof window === "undefined") {
		return null;
	}

	return localStorage.getItem("authToken");
}

export const useUserStore = create<UserStore>((set, get) => ({
	user: null,
	isLoading: false,
	token: getStoredToken(),
	getToken: () => {
		return get().token;
	},
	loadUser: async () => {
		set({ isLoading: true });
		try {
			const token =
				typeof window !== "undefined"
					? localStorage.getItem("authToken")
					: null;

			if (!token) {
				set({ user: null, token: null, isLoading: false });
				return;
			}

			const { data } = await api.get("/users/me");

			set({
				user: data,
				token,
				isLoading: false,
			});
		} catch (error: unknown) {
			if (getErrorStatus(error) === 401) {
				set({ user: null, token: null, isLoading: false });
				return;
			}
			set({
				user: null,
				token:
					typeof window !== "undefined"
						? localStorage.getItem("authToken")
						: null,
				isLoading: false,
			});
		}
	},

	clearUser: () => {
		if (typeof window !== "undefined") {
			localStorage.removeItem("authToken");
		}
		set({ user: null, token: null });
	},
}));
