"use client";

import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { env } from "@/env";
import type { MessageResponse } from "@/lib/schemas/messaging/message.schema";
import { useAuthStore } from "@/store/auth.store";

export function useChat(conversationId: string | null) {
	const [messages, setMessages] = useState<MessageResponse[]>([]);
	const client = useRef<Client | null>(null);
	const token = useAuthStore((s) => s.token);

	useEffect(() => {
		if (!conversationId || !token) return;

		const stompClient = new Client({
			webSocketFactory: () =>
				new SockJS(`${env.NEXT_PUBLIC_API_URL}/ws`) as WebSocket,
			connectHeaders: { Authorization: `Bearer ${token}` },
			onConnect: () => {
				stompClient.subscribe(
					`/topic/conversation.${conversationId}`,
					(msg) => {
						const data: MessageResponse = JSON.parse(msg.body);
						setMessages((prev) => [...prev, data]);
					},
				);
			},
			onStompError: (frame) => {
				console.error("STOMP error", frame);
			},
		});

		stompClient.activate();
		client.current = stompClient;

		return () => {
			stompClient.deactivate();
			client.current = null;
		};
	}, [conversationId, token]);

	function sendMessage(content: string) {
		if (!client.current?.connected || !conversationId) return;
		client.current.publish({
			destination: `/app/chat/${conversationId}`,
			body: JSON.stringify({ content }),
		});
	}

	function resetMessages() {
		setMessages([]);
	}

	return { messages, sendMessage, resetMessages };
}
