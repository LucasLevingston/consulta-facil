"use client";

import { useQuery } from "@tanstack/react-query";
import { professionalsRepository } from "../repositories/professionals.repository";
import { applicationKeys } from "./professional-keys";

export function usePendingApplications(page = 0, size = 20) {
	return useQuery({
		queryKey: [...applicationKeys.all, "list", { page, size }],
		queryFn: () => professionalsRepository.getPendingApplications(page, size),
	});
}
