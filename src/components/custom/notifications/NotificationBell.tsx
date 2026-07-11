"use client";

import { Bell, CheckCheck } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { NotificationItem } from "./NotificationItem";
import { useMarkAllAsRead } from "./use-mark-all-as-read";
import { useNotifications } from "./use-notifications";
import { useUnreadCount } from "./use-unread-count";

export function NotificationBell() {
	const [open, setOpen] = useState(false);
	const { data: unreadCount = 0 } = useUnreadCount();
	const { data: notifications = [] } = useNotifications();
	const markAll = useMarkAllAsRead();

	return (
		<Popover open={open} onOpenChange={setOpen}>
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
