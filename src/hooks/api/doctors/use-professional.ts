"use client";

import { useQuery } from "@tanstack/react-query";
import { professionalsApi } from "@/lib/api/doctors.api";
import { professionalKeys } from "./professional-keys";

export function useProfessional(id: string) {
	return useQuery({
		queryKey: professionalKeys.detail(id),
		queryFn: () => professionalsApi.getById(id),
		enabled: !!id,
	});
}
