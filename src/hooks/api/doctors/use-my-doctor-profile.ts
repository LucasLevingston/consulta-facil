"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyDoctorProfileApi } from "@/lib/api/doctors/get-my-doctor-profile.api";

export function useMyDoctorProfile(enabled: boolean) {
  return useQuery({
    queryKey: ["doctors", "me"],
    queryFn: getMyDoctorProfileApi,
    enabled,
    retry: false,
  });
}
