"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messagingRepository } from "@/features/messaging";
import { conversationKeys } from "./hooks";

export function useMarkAsRead() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => messagingRepository.markAsRead(id),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: conversationKeys.all }),
	});
}
