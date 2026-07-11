"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicsRepository } from "@/features/clinics";
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
		}) => clinicsRepository.addMember(clinicId, professionalProfileId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: clinicKeys.all });
		},
	});
}
