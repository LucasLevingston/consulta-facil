"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyProfessionalProfileApi } from "@/lib/api/professionals/my-professional-profile.api";

export function useMyProfessionalProfile(enabled: boolean) {
	return useQuery({
		queryKey: ["professionals", "me"],
		queryFn: getMyProfessionalProfileApi,
		enabled,
		retry: false,
	});
}
