import { api } from "@/config/api";
import type { CheckoutResponse } from "./create-checkout.api.types";

export type { CheckoutResponse } from "./create-checkout.api.types";

export async function createCheckoutApi(
	planId: string,
): Promise<CheckoutResponse> {
	const response = await api.post<CheckoutResponse>("/subscriptions/checkout", {
		planId,
	});
	return response.data;
}
