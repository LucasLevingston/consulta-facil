"use client";

import { useQuery } from "@tanstack/react-query";
import { usersRepository } from "../repositories/users.repository";

export function useAllUsers(page = 0, size = 20, role?: string) {
	return useQuery({
		queryKey: ["users", page, size, role],
		queryFn: () => usersRepository.getAll(page, size, role),
	});
}
