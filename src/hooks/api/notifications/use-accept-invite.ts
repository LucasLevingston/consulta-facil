"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { notificationsApi } from "@/lib/api/notifications.api";
import { notificationKeys } from "./notification-keys";

export function useAcceptInvite() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => notificationsApi.acceptInvite(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.all });
			queryClient.invalidateQueries({ queryKey: ["clinics"] });
		},
	});
}
