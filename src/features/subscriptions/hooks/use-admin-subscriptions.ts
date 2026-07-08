"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { subscriptionsRepository } from "../repositories/subscriptions.repository";

export function useAdminSubscriptions() {
	return useSuspenseQuery({
		queryKey: ["admin", "subscriptions"],
		queryFn: subscriptionsRepository.adminListAll,
	});
}
