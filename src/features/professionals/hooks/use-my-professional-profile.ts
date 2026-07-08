"use client";

import { useQuery } from "@tanstack/react-query";
import { professionalApplicationsRepository } from "../repositories/professional-applications.repository";

export function useMyProfessionalProfile(enabled: boolean) {
	return useQuery({
		queryKey: ["professionals", "me"],
		queryFn: professionalApplicationsRepository.getMyProfile,
		enabled,
		retry: false,
	});
}
