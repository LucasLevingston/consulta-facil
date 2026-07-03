"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionsRepository } from "../repositories/subscriptions.repository";

export function useAdminCancelSubscription() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => subscriptionsRepository.adminCancel(id),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ["admin", "subscriptions"] }),
	});
}
