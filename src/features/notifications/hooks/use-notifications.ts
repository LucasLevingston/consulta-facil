"use client";

import { useQuery } from "@tanstack/react-query";
import { notificationsRepository } from "../repositories/notifications.repository";
import { notificationKeys } from "./notification-keys";

export function useNotifications() {
	return useQuery({
		queryKey: notificationKeys.list(),
		queryFn: () => notificationsRepository.getAll(),
		refetchInterval: 30_000,
		staleTime: 0,
	});
}
