"use client";

import { cn } from "@/lib/utils/cn";
import { NOTIFICATION_ICON } from "@/utils/constants/notification-icon";
import type { NotificationItemProps } from "./NotificationBell.types";
import { NotificationInviteActions } from "./NotificationInviteActions";

export function NotificationItem({ notification }: NotificationItemProps) {
	function timeAgo(dateStr: string) {
		const diff = Date.now() - new Date(dateStr).getTime();
		const mins = Math.floor(diff / 60_000);
		if (mins < 1) return "agora";
		if (mins < 60) return `${mins}m atrás`;
		const hrs = Math.floor(mins / 60);
		if (hrs < 24) return `${hrs}h atrás`;
		return `${Math.floor(hrs / 24)}d atrás`;
	}

	const isPending = notification.status === "PENDING";
	const {
		icon: Icon,
		color,
		bg,
	} = NOTIFICATION_ICON[notification.type] ?? NOTIFICATION_ICON.GENERAL;

	return (
		<div
			className={cn(
				"flex flex-col gap-2 rounded-lg p-3 transition-colors",
				isPending ? "bg-primary/5" : "bg-transparent",
			)}
		>
			<div className="flex items-start gap-2">
				<div
					className={cn(
						"mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
						bg,
					)}
				>
					<Icon className={cn("h-3.5 w-3.5", color)} />
				</div>
				<div className="min-w-0 flex-1">
					<p className="text-sm font-medium leading-tight text-foreground">
						{notification.title}
					</p>
					<p className="mt-0.5 text-xs text-muted-foreground leading-snug">
						{notification.message}
					</p>
					<p className="mt-1 text-xs text-muted-foreground/60">
						{timeAgo(notification.createdAt)}
					</p>
				</div>
				{isPending && (
					<div className="h-2 w-2 shrink-0 rounded-full bg-primary mt-1" />
				)}
			</div>
			<NotificationInviteActions
				notificationId={notification.id}
				type={notification.type}
				status={notification.status}
			/>
		</div>
	);
}
