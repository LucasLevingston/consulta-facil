"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subscriptionsApi } from "@/lib/api/subscriptions/subscriptions.api";

export function useAdminSubscriptions() {
	return useQuery({
		queryKey: ["admin", "subscriptions"],
		queryFn: subscriptionsApi.adminListAll,
	});
}

export function useAdminCancelSubscription() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => subscriptionsApi.adminCancel(id),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ["admin", "subscriptions"] }),
	});
}
