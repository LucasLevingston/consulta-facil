"use client";

import { useQuery } from "@tanstack/react-query";
import { professionalsApi } from "@/lib/api/doctors.api";
import { applicationKeys } from "./application-keys";

export function usePendingApplications(page = 0, size = 20) {
	return useQuery({
		queryKey: [...applicationKeys.all, "list", { page, size }],
		queryFn: () => professionalsApi.getPendingApplications(page, size),
	});
}
