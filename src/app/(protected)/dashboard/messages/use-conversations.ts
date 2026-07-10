"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { conversationKeys } from "@/components/messaging/hooks";
import { messagingRepository } from "@/features/messaging";

export function useConversations() {
	return useSuspenseQuery({
		queryKey: conversationKeys.all,
		queryFn: messagingRepository.list,
	});
}
