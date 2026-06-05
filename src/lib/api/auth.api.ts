import { api } from "@/config/api";
import type { LoginInput } from "@/lib/schemas/auth/login.schema";
import type { LoginResponse } from "@/lib/schemas/auth/login-response.schema";
import type { RegisterInput } from "@/lib/schemas/auth/register.schema";
import type { UserResponse } from "@/lib/schemas/auth/user-response.schema";

export const authApi = {
	login: async (data: LoginInput): Promise<LoginResponse> => {
		const response = await api.post<LoginResponse>("/auth/login", data);
		return response.data;
	},

	register: async (data: RegisterInput): Promise<UserResponse> => {
		const response = await api.post<UserResponse>("/auth/register", data);
		return response.data;
	},
};
