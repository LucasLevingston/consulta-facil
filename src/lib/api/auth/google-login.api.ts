import { api } from "@/config/api";
import type { LoginResponse } from "@/lib/schemas/auth/login-response.schema";

export async function googleLoginApi(idToken: string): Promise<LoginResponse> {
	const response = await api.post<LoginResponse>("/auth/google", { idToken });
	return response.data;
}
