"use client";

import { useQuery } from "@tanstack/react-query";
import { conversationsApi } from "@/lib/api/conversations.api";
import { conversationKeys } from "./conversation-keys";

export function useConversationHistory(id: string | null, page = 0) {
	return useQuery({
		queryKey: conversationKeys.history(id ?? ""),
		queryFn: () => conversationsApi.getHistory(id as string, page),
		enabled: !!id,
	});
}
