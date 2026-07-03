"use client";

import { useQuery } from "@tanstack/react-query";
import { subscriptionsRepository } from "../repositories/subscriptions.repository";

export function useMySubscription() {
	return useQuery({
		queryKey: ["subscriptions", "me"],
		queryFn: subscriptionsRepository.getMy,
		retry: false,
	});
}
