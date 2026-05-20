"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyProfessionalProfileApi } from "@/lib/api/doctors/get-my-doctor-profile.api";

export function useMyProfessionalProfile(enabled: boolean) {
	return useQuery({
		queryKey: ["professionals", "me"],
		queryFn: getMyProfessionalProfileApi,
		enabled,
		retry: false,
	});
}

// Backwards-compatible alias
export const useMyDoctorProfile = useMyProfessionalProfile;
