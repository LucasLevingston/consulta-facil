"use client";

import { useQuery } from "@tanstack/react-query";

import { notificationsApi } from "@/lib/api/notifications.api";
import { notificationKeys } from "./notification-keys";

export function useNotifications() {
	return useQuery({
		queryKey: notificationKeys.list(),
		queryFn: () => notificationsApi.getAll(),
		refetchInterval: 30_000,
		staleTime: 0,
	});
}
