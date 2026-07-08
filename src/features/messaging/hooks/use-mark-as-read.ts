"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messagingRepository } from "../repositories/messaging.repository";
import { conversationKeys } from "./conversation-keys";

export function useMarkAsRead() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => messagingRepository.markAsRead(id),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: conversationKeys.all }),
	});
}
