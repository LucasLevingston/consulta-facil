"use client";

import { useMutation } from "@tanstack/react-query";
import { createCheckoutApi } from "@/lib/api/subscriptions/create-checkout.api";

export function useCreateCheckout() {
	return useMutation({
		mutationFn: (planId: string) => createCheckoutApi(planId),
		onSuccess: ({ checkoutUrl }) => {
			window.location.href = checkoutUrl;
		},
	});
}
