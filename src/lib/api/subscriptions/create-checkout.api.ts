import { api } from "@/config/api";

export interface CheckoutResponse {
  checkoutUrl: string;
  preferenceId: string;
}

export async function createCheckoutApi(planId: string): Promise<CheckoutResponse> {
  const response = await api.post<CheckoutResponse>("/subscriptions/checkout", { planId });
  return response.data;
}
