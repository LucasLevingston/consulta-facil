"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { usersRepository } from "@/features/users";

export function useAllUsers(page = 0, size = 20, role?: string) {
	return useSuspenseQuery({
		queryKey: ["users", page, size, role],
		queryFn: () => usersRepository.getAll(page, size, role),
	});
}
