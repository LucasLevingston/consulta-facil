"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionsRepository } from "@/features/subscriptions";

export function useAdminCancelSubscription() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => subscriptionsRepository.adminCancel(id),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ["admin", "subscriptions"] }),
	});
}
