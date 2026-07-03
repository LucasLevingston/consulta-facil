"use client";

import { useQuery } from "@tanstack/react-query";
import { subscriptionsRepository } from "../repositories/subscriptions.repository";

export function useAdminSubscriptions() {
	return useQuery({
		queryKey: ["admin", "subscriptions"],
		queryFn: subscriptionsRepository.adminListAll,
	});
}
