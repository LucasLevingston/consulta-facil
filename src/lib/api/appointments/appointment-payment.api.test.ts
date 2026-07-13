import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { appointmentPaymentApi } from "./appointment-payment.api";

const mockPost = vi.mocked(api.post);

describe("appointmentPaymentApi", () => {
	beforeEach(() => vi.clearAllMocks());

	it("createPayment — chama POST /appointments/:id/payment sem amount", async () => {
		const payment = {
			checkoutUrl: "https://mp.com/checkout",
			preferenceId: "pref-1",
			appointmentId: "a-1",
		};
		mockPost.mockResolvedValueOnce({ data: payment });

		const result = await appointmentPaymentApi.createPayment("a-1");

		expect(mockPost).toHaveBeenCalledWith("/appointments/a-1/payment", null, {
			params: {},
		});
		expect(result.checkoutUrl).toContain("mp.com");
	});

	it("createPayment — envia amount quando definido", async () => {
		const payment = {
			checkoutUrl: "https://mp.com/checkout",
			preferenceId: "pref-2",
			appointmentId: "a-1",
		};
		mockPost.mockResolvedValueOnce({ data: payment });

		await appointmentPaymentApi.createPayment("a-1", 350);

		expect(mockPost).toHaveBeenCalledWith(
			"/appointments/a-1/payment",
			null,
			expect.objectContaining({ params: { amount: 350 } }),
		);
	});
});
