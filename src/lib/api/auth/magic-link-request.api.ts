import { api } from "@/config/api";

export async function magicLinkRequestApi(email: string): Promise<void> {
	await api.post("/auth/magic-link", { email });
}
