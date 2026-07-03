"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicsRepository } from "../repositories/clinics.repository";
import { clinicKeys } from "./clinic-keys";

export function useRemoveReceptionist(clinicId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (receptionistId: string) =>
			clinicsRepository.removeReceptionist(clinicId, receptionistId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: clinicKeys.receptionists(clinicId),
			});
		},
	});
}
