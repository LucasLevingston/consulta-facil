"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { conversationsApi } from "@/lib/api/conversations/conversations.api";
import { conversationKeys } from "./conversation-keys";

export function useStartConversation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (professionalId: string) =>
			conversationsApi.getOrCreate(professionalId),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: conversationKeys.all }),
	});
}
