"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { clinicsApi } from "@/lib/api/clinics.api";
import type { InviteReceptionistInput } from "@/lib/schemas/clinic.schema";
import { clinicKeys } from "./clinic-keys";

export function useInviteReceptionist(clinicId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: InviteReceptionistInput) =>
			clinicsApi.inviteReceptionist(clinicId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: clinicKeys.receptionists(clinicId),
			});
		},
	});
}
