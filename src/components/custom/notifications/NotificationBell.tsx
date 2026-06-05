"use client";

import { Bell, Check, CheckCheck, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAcceptInvite } from "@/hooks/api/notifications/use-accept-invite";
import { useDeclineInvite } from "@/hooks/api/notifications/use-decline-invite";
import { useMarkAllAsRead } from "@/hooks/api/notifications/use-mark-all-as-read";
import { useNotifications } from "@/hooks/api/notifications/use-notifications";
import { useUnreadCount } from "@/hooks/api/notifications/use-unread-count";
import type { NotificationResponse } from "@/lib/schemas/notification/notification.schema";
import { cn } from "@/lib/utils/cn";
import { NOTIFICATION_ICON } from "@/utils/constants/notification-icon";

function timeAgo(dateStr: string) {
	const diff = Date.now() - new Date(dateStr).getTime();
	const mins = Math.floor(diff / 60_000);
	if (mins < 1) return "agora";
	if (mins < 60) return `${mins}m atrás`;
	const hrs = Math.floor(mins / 60);
	if (hrs < 24) return `${hrs}h atrás`;
	return `${Math.floor(hrs / 24)}d atrás`;
}

interface NotificationItemProps {
	notification: NotificationResponse;
}

function NotificationItem({ notification }: NotificationItemProps) {
	const accept = useAcceptInvite();
	const decline = useDeclineInvite();
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

			{notification.type === "CLINIC_INVITE" && isPending && (
				<div className="flex gap-2 pl-9">
					<Button
						size="sm"
						className="h-7 rounded-lg px-3 text-xs"
						disabled={accept.isPending || decline.isPending}
						onClick={() =>
							accept.mutate(notification.id, {
								onSuccess: () => toast.success("Você entrou na clínica!"),
								onError: () => toast.error("Erro ao aceitar convite."),
							})
						}
					>
						<Check className="mr-1 h-3 w-3" />
						Aceitar
					</Button>
					<Button
						size="sm"
						variant="outline"
						className="h-7 rounded-lg px-3 text-xs"
						disabled={accept.isPending || decline.isPending}
						onClick={() =>
							decline.mutate(notification.id, {
								onSuccess: () => toast.info("Convite recusado."),
								onError: () => toast.error("Erro ao recusar convite."),
							})
						}
					>
						<X className="mr-1 h-3 w-3" />
						Recusar
					</Button>
				</div>
			)}

			{notification.status === "ACCEPTED" && (
				<p className="pl-9 text-xs text-emerald-600 dark:text-emerald-400">
					Convite aceito
				</p>
			)}
			{notification.status === "DECLINED" && (
				<p className="pl-9 text-xs text-muted-foreground">Convite recusado</p>
			)}
		</div>
	);
}

export function NotificationBell() {
	const [open, setOpen] = useState(false);
	const { data: unreadCount = 0 } = useUnreadCount();
	const { data: notifications = [] } = useNotifications();
	const markAll = useMarkAllAsRead();

	function handleOpen(next: boolean) {
		setOpen(next);
	}

	return (
		<Popover open={open} onOpenChange={handleOpen}>
			<PopoverTrigger asChild>
				<Button
					size="icon"
					className="relative h-10 w-10 rounded-2xl border border-border bg-background/60 text-foreground backdrop-blur hover:bg-primary/10 hover:text-primary"
				>
					<Bell className="h-4 w-4" />
					{unreadCount > 0 && (
						<Badge className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary p-0 text-[10px] text-primary-foreground">
							{unreadCount > 9 ? "9+" : unreadCount}
						</Badge>
					)}
				</Button>
			</PopoverTrigger>

			<PopoverContent align="end" className="w-80 p-0" sideOffset={8}>
				<div className="flex items-center justify-between px-4 py-3">
					<p className="text-sm font-semibold text-foreground">Notificações</p>
					{unreadCount > 0 && (
						<Button
							variant="ghost"
							size="sm"
							className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
							onClick={() => markAll.mutate()}
						>
							<CheckCheck className="h-3 w-3" />
							Marcar todas como lidas
						</Button>
					)}
				</div>

				<Separator />

				{notifications.length === 0 ? (
					<div className="flex flex-col items-center gap-2 py-10 text-center">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
							<Bell className="h-5 w-5 text-muted-foreground" />
						</div>
						<p className="text-sm text-muted-foreground">Nenhuma notificação</p>
					</div>
				) : (
					<ScrollArea className="max-h-[360px]">
						<div className="flex flex-col gap-1 p-2">
							{notifications.map((n, i) => (
								<div key={n.id}>
									<NotificationItem notification={n} />
									{i < notifications.length - 1 && (
										<Separator className="my-1 opacity-50" />
									)}
								</div>
							))}
						</div>
					</ScrollArea>
				)}
			</PopoverContent>
		</Popover>
	);
}
