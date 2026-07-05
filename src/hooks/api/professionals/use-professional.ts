"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { professionalsListingApi } from "@/lib/api/professionals/professionals.api";
import { professionalKeys } from "./professional-keys";

export function useProfessional(id: string) {
	return useSuspenseQuery({
		queryKey: professionalKeys.detail(id),
		queryFn: () => professionalsListingApi.getById(id),
	});
}
