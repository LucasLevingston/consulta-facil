"use client";

import { useQuery } from "@tanstack/react-query";
import { notificationsRepository } from "../repositories/notifications.repository";
import { notificationKeys } from "./notification-keys";

export function useUnreadCount() {
	return useQuery({
		queryKey: notificationKeys.unreadCount(),
		queryFn: notificationsRepository.getUnreadCount,
		refetchInterval: 30_000,
		staleTime: 0,
	});
}
