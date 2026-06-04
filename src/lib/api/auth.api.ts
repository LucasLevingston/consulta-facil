import { api } from "@/config/api";
import type {
	LoginInput,
	LoginResponse,
	RegisterInput,
	UserResponse,
} from "@/lib/schemas/auth.schema";

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
