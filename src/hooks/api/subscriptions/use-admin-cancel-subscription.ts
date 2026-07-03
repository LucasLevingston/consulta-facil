"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionsApi } from "@/lib/api/subscriptions/subscriptions.api";

export function useAdminCancelSubscription() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => subscriptionsApi.adminCancel(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "subscriptions"] }),
	});
}
