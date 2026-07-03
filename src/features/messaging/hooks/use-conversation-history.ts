"use client";

import { useQuery } from "@tanstack/react-query";
import { messagingRepository } from "../repositories/messaging.repository";
import { conversationKeys } from "./conversation-keys";

export function useConversationHistory(id: string | null, page = 0) {
	return useQuery({
		queryKey: conversationKeys.history(id ?? ""),
		queryFn: () => messagingRepository.getHistory(id as string, page),
		enabled: !!id,
	});
}
