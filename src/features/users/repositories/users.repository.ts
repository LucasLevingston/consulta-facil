import { usersApi } from "@/lib/api/users/users.api";
import type { ApiPage } from "@/lib/schemas/professional/api-page.schema";
import type { UserResponse } from "@/lib/schemas/user/user-response.schema";

export const usersRepository = {
	getAll: (
		page = 0,
		size = 20,
		role?: string,
	): Promise<ApiPage<UserResponse>> => usersApi.getAll(page, size, role),
};
