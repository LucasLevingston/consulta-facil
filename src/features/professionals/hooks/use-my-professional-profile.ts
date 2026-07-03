"use client";

import { useQuery } from "@tanstack/react-query";
import { professionalsRepository } from "../repositories/professionals.repository";

export function useMyProfessionalProfile(enabled: boolean) {
	return useQuery({
		queryKey: ["professionals", "me"],
		queryFn: professionalsRepository.getMe,
		enabled,
		retry: false,
	});
}
