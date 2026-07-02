"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/features/auth";
import type { MessageResponse } from "@/features/messaging";
import {
	useChat,
	useConversationHistory,
	useMarkAsRead,
} from "@/features/messaging";
import { ChatMessageBubble } from "./ChatMessageBubble";
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
		<div className="flex h-full flex-col">
			<div className="flex shrink-0 items-center gap-3 border-b px-4 py-3">
				<Avatar className="h-9 w-9">
					<AvatarImage src={conversation.otherUserImageUrl ?? undefined} />
					<AvatarFallback>
						{conversation.otherUserName.charAt(0).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<p className="text-sm font-medium">{conversation.otherUserName}</p>
			</div>
			<div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
				{allMessages.map((msg, i) => (
					<ChatMessageBubble
						key={msg.id ?? `live-${i}`}
						msgKey={msg.id ?? `live-${i}`}
						msg={msg}
						isOwn={msg.senderId === user?.id}
					/>
				))}
				<div ref={bottomRef} />
			</div>
			<div className="flex shrink-0 items-center gap-2 border-t px-4 py-3">
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
