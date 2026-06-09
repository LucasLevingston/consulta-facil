"use client";

import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users.api";

export function useAllUsers(page = 0, size = 20, role?: string) {
	return useQuery({
		queryKey: ["users", page, size, role],
		queryFn: () => usersApi.getAll(page, size, role),
	});
}
