"use client";

import { useMutation } from "@tanstack/react-query";

import { notificationsApi } from "@/lib/api/notifications.api";

export function useSendClinicInvite() {
	return useMutation({
		mutationFn: ({
			clinicId,
			professionalProfileId,
		}: {
			clinicId: string;
			professionalProfileId: string;
		}) => notificationsApi.sendClinicInvite(clinicId, professionalProfileId),
	});
}
