"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MessageResponse } from "@/features/messaging";
import { useConversationHistory, useMarkAsRead } from "@/features/messaging";
import { useChat } from "@/hooks/use-chat";
import { cn } from "@/lib/utils/cn";
import { useUserStore } from "@/store/useUserStore";
import type { ChatThreadProps } from "./ChatThread.types";

export function ChatThread({ conversation }: ChatThreadProps) {
	const user = useUserStore((s) => s.user);
	const { data: historyPage } = useConversationHistory(conversation.id);
	const markAsRead = useMarkAsRead();
	const {
		messages: liveMessages,
		sendMessage,
		resetMessages,
	} = useChat(conversation.id);
	const [input, setInput] = useState("");
	const bottomRef = useRef<HTMLDivElement>(null);

	const historicalMessages: MessageResponse[] = historyPage?.content
		? [...historyPage.content].reverse()
		: [];

	useEffect(() => {
		resetMessages();
		markAsRead.mutate(conversation.id);
	}, [conversation.id, resetMessages, markAsRead.mutate]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: trigger scroll when messages grow
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [liveMessages.length]);

	function handleSend() {
		if (!input.trim()) return;
		sendMessage(input.trim());
		setInput("");
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") handleSend();
	}

	const allMessages = [...historicalMessages, ...liveMessages];

	return (
		<div className="flex flex-col h-full">
			{/* Header */}
			<div className="flex items-center gap-3 px-4 py-3 border-b shrink-0">
				<Avatar className="h-9 w-9">
					<AvatarImage src={conversation.otherUserImageUrl ?? undefined} />
					<AvatarFallback>
						{conversation.otherUserName.charAt(0).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<p className="font-medium text-sm">{conversation.otherUserName}</p>
			</div>

			{/* Messages */}
			<div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
				{allMessages.map((msg, i) => {
					const isOwn = msg.senderId === user?.id;
					return (
						<div
							key={msg.id ?? `live-${i}`}
							className={cn("flex", isOwn ? "justify-end" : "justify-start")}
						>
							<div
								className={cn(
									"max-w-[70%] rounded-2xl px-4 py-2 text-sm",
									isOwn
										? "bg-primary text-primary-foreground rounded-br-sm"
										: "bg-muted rounded-bl-sm",
								)}
							>
								{msg.content}
							</div>
						</div>
					);
				})}
				<div ref={bottomRef} />
			</div>

			{/* Input */}
			<div className="flex items-center gap-2 px-4 py-3 border-t shrink-0">
				<Input
					placeholder="Escreva uma mensagem..."
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					className="flex-1"
				/>
				<Button onClick={handleSend} disabled={!input.trim()}>
					Enviar
				</Button>
			</div>
		</div>
	);
}
