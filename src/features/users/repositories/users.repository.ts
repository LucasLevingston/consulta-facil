import { api } from "@/config/api";
import type { ApiPage } from "@/lib/schemas/professional/api-page.schema";
import type { UserResponse } from "@/lib/schemas/user/user-response.schema";

export const usersRepository = {
	getAll: async (
		page = 0,
		size = 20,
		role?: string,
	): Promise<ApiPage<UserResponse>> => {
		const res = await api.get<ApiPage<UserResponse>>("/users", {
			params: { page, size, role: role || undefined },
		});
		return res.data;
	},
};
