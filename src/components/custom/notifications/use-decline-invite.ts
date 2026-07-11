"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsRepository } from "@/features/notifications";
import { notificationKeys } from "./notification-keys";

export function useDeclineInvite() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => notificationsRepository.declineInvite(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.all });
		},
	});
}
