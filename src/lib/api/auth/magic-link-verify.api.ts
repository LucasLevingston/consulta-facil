import { api } from "@/config/api";
import type { LoginResponse } from "@/lib/schemas/auth/login-response.schema";

export async function magicLinkVerifyApi(
	token: string,
): Promise<LoginResponse> {
	const response = await api.get<LoginResponse>("/auth/magic-link/verify", {
		params: { token },
	});
	return response.data;
}
