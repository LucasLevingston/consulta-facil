"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { clinicsApi } from "@/lib/api/clinics.api";
import { clinicKeys } from "./clinic-keys";

export function useAddClinicMember() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			clinicId,
			professionalProfileId,
		}: {
			clinicId: string;
			professionalProfileId: string;
		}) => clinicsApi.addMember(clinicId, professionalProfileId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: clinicKeys.all });
		},
	});
}
