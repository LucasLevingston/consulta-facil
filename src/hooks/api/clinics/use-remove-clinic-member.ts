"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { clinicsCrudApi } from "@/lib/api/clinics/clinics.api";
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
		}) => clinicsCrudApi.removeMember(clinicId, professionalProfileId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: clinicKeys.all });
		},
	});
}
