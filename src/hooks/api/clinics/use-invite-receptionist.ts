"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { clinicStaffApi } from "@/lib/api/clinics/clinic-staff.api";
import type { InviteReceptionistInput } from "@/lib/schemas/clinic/invite-receptionist.schema";
import { clinicKeys } from "./clinic-keys";

export function useInviteReceptionist(clinicId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: InviteReceptionistInput) =>
			clinicStaffApi.inviteReceptionist(clinicId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: clinicKeys.receptionists(clinicId),
			});
		},
	});
}
