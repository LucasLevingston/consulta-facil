"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { invitesApi } from "@/lib/api/notifications/invites.api";
import { notificationKeys } from "./notification-keys";

export function useDeclineInvite() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => invitesApi.declineInvite(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.all });
		},
	});
}
