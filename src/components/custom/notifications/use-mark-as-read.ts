"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsRepository } from "@/features/notifications";
import { notificationKeys } from "./notification-keys";

export function useMarkAsRead() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => notificationsRepository.markAsRead(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.all });
		},
	});
}
