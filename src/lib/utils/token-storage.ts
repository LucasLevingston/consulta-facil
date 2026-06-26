import Cookies from "js-cookie";
import { api } from "@/config/api";

const TOKEN_KEY = "authToken";
const COOKIE_KEY = "token";

export function getStoredToken(): string | null {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null): void {
	if (typeof window === "undefined") return;

	if (token) {
		localStorage.setItem(TOKEN_KEY, token);
		Cookies.set(COOKIE_KEY, token);
		api.defaults.headers.common.Authorization = `Bearer ${token}`;
		return;
	}

	localStorage.removeItem(TOKEN_KEY);
	Cookies.remove(COOKIE_KEY);
	delete api.defaults.headers.common.Authorization;
}
