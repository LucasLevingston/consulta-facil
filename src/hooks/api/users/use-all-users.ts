"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users/users.api";

export function useAllUsers(page = 0, size = 20, role?: string) {
	return useSuspenseQuery({
		queryKey: ["users", page, size, role],
		queryFn: () => usersApi.getAll(page, size, role),
	});
}
