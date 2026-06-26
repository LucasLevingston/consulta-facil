"use client";

import { useQuery } from "@tanstack/react-query";
import { conversationsApi } from "@/lib/api/conversations.api";
import { conversationKeys } from "./conversation-keys";

export function useConversations() {
	return useQuery({
		queryKey: conversationKeys.all,
		queryFn: conversationsApi.list,
	});
}
