import { api } from "@/config/api";

export async function forgotPasswordApi(email: string): Promise<void> {
	await api.post("/auth/forgot-password", { email });
}
