import { api } from "@/config/api";
import type { RegisterInput, UserResponse } from "@/lib/schemas/auth.schema";

export async function registerApi(data: RegisterInput): Promise<UserResponse> {
	const response = await api.post<UserResponse>("/auth/register", data);
	return response.data;
}
