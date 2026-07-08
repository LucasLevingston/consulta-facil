"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { subscriptionsRepository } from "../repositories/subscriptions.repository";

export function useMySubscription() {
	return useSuspenseQuery({
		queryKey: ["subscriptions", "me"],
		queryFn: subscriptionsRepository.getMy,
		retry: false,
	});
}
