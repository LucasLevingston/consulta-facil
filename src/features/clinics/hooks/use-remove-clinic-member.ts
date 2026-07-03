"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicsRepository } from "../repositories/clinics.repository";
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
		}) => clinicsRepository.removeMember(clinicId, professionalProfileId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: clinicKeys.all });
		},
	});
}
