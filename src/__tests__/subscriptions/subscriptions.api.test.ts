import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn() },
}));

import { api } from "@/config/api";
import { createCheckoutApi } from "@/lib/api/subscriptions/create-checkout.api";
import { getMySubscriptionApi } from "@/lib/api/subscriptions/get-my-subscription.api";

const mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);

const subscription = {
	id: "sub-1",
	planId: "monthly",
	status: "ACTIVE" as const,
	expiresAt: "2027-05-01T00:00:00Z",
	createdAt: "2026-05-01T00:00:00Z",
};

describe("getMySubscriptionApi", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama GET /subscriptions/me e retorna a assinatura ativa", async () => {
		mockGet.mockResolvedValueOnce({ status: 200, data: subscription });

		const result = await getMySubscriptionApi();

		expect(mockGet).toHaveBeenCalledWith("/subscriptions/me");
		expect(result?.status).toBe("ACTIVE");
		expect(result?.planId).toBe("monthly");
	});

	it("retorna null quando a resposta é 204 (sem assinatura)", async () => {
		mockGet.mockResolvedValueOnce({ status: 204, data: null });

		const result = await getMySubscriptionApi();

		expect(result).toBeNull();
	});

	it("propaga o erro em caso de falha de rede", async () => {
		mockGet.mockRejectedValueOnce(new Error("Network Error"));

		await expect(getMySubscriptionApi()).rejects.toThrow("Network Error");
	});
});

describe("createCheckoutApi", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama POST /subscriptions/checkout com o planId e retorna o checkoutUrl", async () => {
		const checkout = {
			checkoutUrl: "https://mp.com/checkout/123",
			preferenceId: "pref-1",
		};
		mockPost.mockResolvedValueOnce({ data: checkout });

		const result = await createCheckoutApi("monthly");

		expect(mockPost).toHaveBeenCalledWith("/subscriptions/checkout", {
			planId: "monthly",
		});
		expect(result.checkoutUrl).toBe("https://mp.com/checkout/123");
	});

	it("propaga o erro quando o checkout falha", async () => {
		mockPost.mockRejectedValueOnce(new Error("Payment Error"));

		await expect(createCheckoutApi("yearly")).rejects.toThrow("Payment Error");
	});
});
