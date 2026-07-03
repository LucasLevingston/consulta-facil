"use client";

import { useQuery } from "@tanstack/react-query";
import { professionalApplicationsApi } from "@/lib/api/professionals/professional-applications.api";
import { applicationKeys } from "./application-keys";

export function usePendingApplications(page = 0, size = 20) {
	return useQuery({
		queryKey: [...applicationKeys.all, "list", { page, size }],
		queryFn: () => professionalApplicationsApi.getPendingApplications(page, size),
	});
}
