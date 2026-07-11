"use client";

import { useMutation } from "@tanstack/react-query";
import { notificationsRepository } from "@/features/notifications";

export function useSendClinicInvite() {
	return useMutation({
		mutationFn: ({
			clinicId,
			professionalProfileId,
		}: {
			clinicId: string;
			professionalProfileId: string;
		}) =>
			notificationsRepository.sendClinicInvite(clinicId, professionalProfileId),
	});
}
