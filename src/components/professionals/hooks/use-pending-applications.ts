"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { professionalApplicationsRepository } from "@/features/professionals";
import { applicationKeys } from "./application-keys";

export function usePendingApplications(page = 0, size = 20) {
	return useSuspenseQuery({
		queryKey: [...applicationKeys.all, "list", { page, size }],
		queryFn: () =>
			professionalApplicationsRepository.getPendingApplications(page, size),
	});
}
