"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { conversationKeys } from "@/components/messaging/hooks";
import { messagingRepository } from "@/features/messaging";

export function useStartConversation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (professionalId: string) =>
			messagingRepository.getOrCreate(professionalId),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: conversationKeys.all }),
	});
}
