"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsRepository } from "../repositories/notifications.repository";
import { notificationKeys } from "./notification-keys";

export function useAcceptInvite() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => notificationsRepository.acceptInvite(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.all });
			queryClient.invalidateQueries({ queryKey: ["clinics"] });
		},
	});
}
