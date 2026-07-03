"use client";

import { useQuery } from "@tanstack/react-query";
import { messagingRepository } from "../repositories/messaging.repository";
import { conversationKeys } from "./conversation-keys";

export function useConversations() {
	return useQuery({
		queryKey: conversationKeys.all,
		queryFn: messagingRepository.list,
	});
}
