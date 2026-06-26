"use client";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { ConversationResponse } from "@/lib/schemas/messaging/message.schema";
import { cn } from "@/lib/utils/cn";

interface Props {
	conversations: ConversationResponse[];
	selectedId: string | null;
	onSelect: (id: string) => void;
}

export function ConversationList({
	conversations,
	selectedId,
	onSelect,
}: Props) {
	if (conversations.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-full gap-2 py-12 text-muted-foreground">
				<MessageCircle className="h-8 w-8" />
				<p className="text-sm">Nenhuma conversa ainda.</p>
			</div>
		);
	}

	return (
		<ul className="divide-y">
			{conversations.map((c) => (
				<li key={c.id}>
					<button
						type="button"
						className={cn(
							"w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50",
							selectedId === c.id && "bg-muted",
						)}
						onClick={() => onSelect(c.id)}
					>
						<Avatar className="h-10 w-10 shrink-0">
							<AvatarImage src={c.otherUserImageUrl ?? undefined} />
							<AvatarFallback>
								{c.otherUserName.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1 min-w-0">
							<div className="flex items-center justify-between gap-2">
								<p className="text-sm font-medium truncate">
									{c.otherUserName}
								</p>
								{c.lastMessage && (
									<span className="text-xs text-muted-foreground shrink-0">
										{formatDistanceToNow(new Date(c.lastMessage.sentAt), {
											addSuffix: true,
											locale: ptBR,
										})}
									</span>
								)}
							</div>
							<p className="text-xs text-muted-foreground truncate">
								{c.lastMessage?.content ?? "Iniciar conversa"}
							</p>
						</div>
						{c.unreadCount > 0 && (
							<Badge className="shrink-0 h-5 min-w-5 flex items-center justify-center text-xs rounded-full px-1">
								{c.unreadCount}
							</Badge>
						)}
					</button>
				</li>
			))}
		</ul>
	);
}
