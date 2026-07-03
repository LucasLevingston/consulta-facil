"use client";

import { useMutation } from "@tanstack/react-query";
import { subscriptionsRepository } from "../repositories/subscriptions.repository";

export function useCreateCheckout() {
	return useMutation({
		mutationFn: (planId: string) =>
			subscriptionsRepository.createCheckout(planId),
		onSuccess: ({ checkoutUrl }) => {
			window.location.href = checkoutUrl;
		},
	});
}
