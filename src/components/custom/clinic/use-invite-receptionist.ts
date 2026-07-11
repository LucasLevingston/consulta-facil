"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicKeys } from "@/components/clinic/hooks";
import { clinicsRepository } from "@/features/clinics";
import type { InviteReceptionistInput } from "@/lib/schemas/clinic/invite-receptionist.schema";

export function useInviteReceptionist(clinicId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: InviteReceptionistInput) =>
			clinicsRepository.inviteReceptionist(clinicId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: clinicKeys.receptionists(clinicId),
			});
		},
	});
}
