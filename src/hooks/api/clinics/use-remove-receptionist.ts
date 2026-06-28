"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { clinicStaffApi } from "@/lib/api/clinics/clinic-staff.api";
import { clinicKeys } from "./clinic-keys";

export function useRemoveReceptionist(clinicId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (receptionistId: string) =>
			clinicStaffApi.removeReceptionist(clinicId, receptionistId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: clinicKeys.receptionists(clinicId),
			});
		},
	});
}
