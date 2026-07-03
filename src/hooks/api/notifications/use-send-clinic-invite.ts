"use client";

import { useMutation } from "@tanstack/react-query";

import { invitesApi } from "@/lib/api/notifications/invites.api";

export function useSendClinicInvite() {
	return useMutation({
		mutationFn: ({
			clinicId,
			professionalProfileId,
		}: {
			clinicId: string;
			professionalProfileId: string;
		}) => invitesApi.sendClinicInvite(clinicId, professionalProfileId),
	});
}
