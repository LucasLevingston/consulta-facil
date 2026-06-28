"use client";

import { useQuery } from "@tanstack/react-query";
import { professionalApplicationsApi } from "@/lib/api/professionals/professional-applications.api";
import { applicationKeys } from "./application-keys";

export function useApplicationStatus() {
	return useQuery({
		queryKey: applicationKeys.status(),
		queryFn: () => professionalApplicationsApi.getApplicationStatus(),
		retry: false,
	});
}
