import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn() },
}));

import { api } from "@/config/api";
import { createCheckoutApi } from "./create-checkout.api";

const mockPost = vi.mocked(api.post);

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
