"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messagingRepository } from "../repositories/messaging.repository";
import { conversationKeys } from "./conversation-keys";

export function useStartConversation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (professionalId: string) =>
			messagingRepository.getOrCreate(professionalId),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: conversationKeys.all }),
	});
}
