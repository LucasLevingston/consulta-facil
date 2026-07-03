"use client";

import { useQuery } from "@tanstack/react-query";
import { subscriptionsApi } from "@/lib/api/subscriptions/subscriptions.api";

export function useAdminSubscriptions() {
	return useQuery({ queryKey: ["admin", "subscriptions"], queryFn: subscriptionsApi.adminListAll });
}
