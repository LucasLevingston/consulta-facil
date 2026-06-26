"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { conversationsApi } from "@/lib/api/conversations.api";
import { conversationKeys } from "./conversation-keys";

export function useMarkAsRead() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => conversationsApi.markAsRead(id),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: conversationKeys.all }),
	});
}
