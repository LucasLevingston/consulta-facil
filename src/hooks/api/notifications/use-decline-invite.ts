"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { notificationsApi } from "@/lib/api/notifications.api";
import { notificationKeys } from "./notification-keys";

export function useDeclineInvite() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => notificationsApi.declineInvite(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.all });
		},
	});
}
