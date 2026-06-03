"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { clinicsApi } from "@/lib/api/clinics.api";
import { clinicKeys } from "./clinic-keys";

export function useRemoveReceptionist(clinicId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (receptionistId: string) =>
			clinicsApi.removeReceptionist(clinicId, receptionistId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: clinicKeys.receptionists(clinicId),
			});
		},
	});
}
