"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { messagingRepository } from "../repositories/messaging.repository";
import { conversationKeys } from "./conversation-keys";

export function useConversations() {
	return useSuspenseQuery({
		queryKey: conversationKeys.all,
		queryFn: messagingRepository.list,
	});
}
