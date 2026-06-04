"use client";

import { useQuery } from "@tanstack/react-query";
import { getMySubscriptionApi } from "@/lib/api/subscriptions/get-my-subscription.api";

export function useMySubscription() {
	return useQuery({
		queryKey: ["subscriptions", "me"],
		queryFn: getMySubscriptionApi,
		retry: false,
	});
}
