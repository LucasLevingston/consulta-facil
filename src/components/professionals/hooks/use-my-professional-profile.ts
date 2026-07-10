"use client";

import { useQuery } from "@tanstack/react-query";
import { professionalApplicationsRepository } from "@/features/professionals";

export function useMyProfessionalProfile(enabled: boolean) {
	return useQuery({
		queryKey: ["professionals", "me"],
		queryFn: professionalApplicationsRepository.getMyProfile,
		enabled,
		retry: false,
	});
}
