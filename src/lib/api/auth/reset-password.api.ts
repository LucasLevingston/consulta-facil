import { api } from "@/config/api";

export async function resetPasswordApi(
	token: string,
	newPassword: string,
): Promise<void> {
	await api.post("/auth/reset-password", { token, newPassword });
}
