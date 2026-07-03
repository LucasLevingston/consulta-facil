"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { notificationsApi } from "@/lib/api/notifications/notifications.api";
import { notificationKeys } from "./notification-keys";

export function useMarkAllAsRead() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => notificationsApi.markAllAsRead(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.all });
		},
	});
}
