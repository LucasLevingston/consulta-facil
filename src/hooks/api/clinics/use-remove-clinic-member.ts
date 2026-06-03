"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { clinicsApi } from "@/lib/api/clinics.api";
import { clinicKeys } from "./clinic-keys";

export function useRemoveClinicMember() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			clinicId,
			professionalProfileId,
		}: {
			clinicId: string;
			professionalProfileId: string;
		}) => clinicsApi.removeMember(clinicId, professionalProfileId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: clinicKeys.all });
		},
	});
}
