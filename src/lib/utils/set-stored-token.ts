import Cookies from "js-cookie";
import { api } from "@/config/api";

export function setStoredToken(token: string | null): void {
	if (typeof window === "undefined") return;

	if (token) {
		localStorage.setItem("authToken", token);
		Cookies.set("token", token);
		api.defaults.headers.common.Authorization = `Bearer ${token}`;
		return;
	}

	localStorage.removeItem("authToken");
	Cookies.remove("token");
	delete api.defaults.headers.common.Authorization;
}
