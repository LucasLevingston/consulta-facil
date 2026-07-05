"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { conversationsApi } from "@/lib/api/conversations/conversations.api";
import { conversationKeys } from "./conversation-keys";

export function useConversations() {
	return useSuspenseQuery({
		queryKey: conversationKeys.all,
		queryFn: conversationsApi.list,
	});
}
