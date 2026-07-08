"use client";

import { useMutation } from "@tanstack/react-query";
import { notificationsRepository } from "../repositories/notifications.repository";

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
