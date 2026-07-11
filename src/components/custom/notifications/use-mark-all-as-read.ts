"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsRepository } from "@/features/notifications";
import { notificationKeys } from "./notification-keys";

export function useMarkAllAsRead() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => notificationsRepository.markAllAsRead(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.all });
		},
	});
}
