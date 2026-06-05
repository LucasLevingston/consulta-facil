import { api } from "@/config/api";
import type { RegisterInput } from "@/lib/schemas/auth/register.schema";
import type { UserResponse } from "@/lib/schemas/auth/user-response.schema";

export async function registerApi(data: RegisterInput): Promise<UserResponse> {
	const response = await api.post<UserResponse>("/auth/register", data);
	return response.data;
}
