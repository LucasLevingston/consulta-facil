"use client";

import { useQuery } from "@tanstack/react-query";
import { professionalsApi } from "@/lib/api/doctors.api";
import { applicationKeys } from "./application-keys";

export function useApplicationStatus() {
	return useQuery({
		queryKey: applicationKeys.status(),
		queryFn: () => professionalsApi.getApplicationStatus(),
		retry: false,
	});
}
