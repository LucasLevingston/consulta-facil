import { create } from "zustand";
import { api } from "@/config/api";
import type { UserResponse } from "@/lib/schemas/auth/user-response.schema";
import { getStoredToken, setStoredToken } from "@/lib/utils/token-storage";

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

export const useUserStore = create<UserStore>((set, get) => ({
	user: null,
	isLoading: false,
	token: getStoredToken(),
	getToken: () => get().token,
	loadUser: async () => {
		set({ isLoading: true });
		try {
			const token = getStoredToken();

			if (!token) {
				set({ user: null, token: null, isLoading: false });
				return;
			}

			const { data } = await api.get("/users/me");

			set({ user: data, token, isLoading: false });
		} catch (error: unknown) {
			if (getErrorStatus(error) === 401) {
				set({ user: null, token: null, isLoading: false });
				return;
			}
			set({ user: null, token: getStoredToken(), isLoading: false });
		}
	},

	clearUser: () => {
		setStoredToken(null);
		set({ user: null, token: null });
	},
}));
