"use client";

import { useQuery } from "@tanstack/react-query";

import { notificationsApi } from "@/lib/api/notifications.api";
import { notificationKeys } from "./notification-keys";

export function useUnreadCount() {
	return useQuery({
		queryKey: notificationKeys.unreadCount(),
		queryFn: () => notificationsApi.getUnreadCount(),
		refetchInterval: 30_000,
		staleTime: 0,
	});
}
