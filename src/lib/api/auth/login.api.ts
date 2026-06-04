import { api } from "@/config/api";
import type { LoginInput, LoginResponse } from "@/lib/schemas/auth.schema";

export async function loginApi(data: LoginInput): Promise<LoginResponse> {
	try {
		const response = await api.post<LoginResponse>("/auth/login", data);

		return response.data;
	} catch (error) {
		console.error("Login failed:", error);
		throw error;
	}
}
