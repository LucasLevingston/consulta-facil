"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InviteReceptionistInput } from "@/lib/schemas/clinic/invite-receptionist.schema";
import { clinicsRepository } from "../repositories/clinics.repository";
import { clinicKeys } from "./clinic-keys";

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
