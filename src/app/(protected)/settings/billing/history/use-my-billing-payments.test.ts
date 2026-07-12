import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-payment.repository", () => ({
	billingPaymentRepository: {
		listMyPayments: vi.fn().mockResolvedValue([]),
	},
}));

import { useMyBillingPayments } from "./use-my-billing-payments";

function makeWrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useMyBillingPayments", () => {
	beforeEach(() => vi.clearAllMocks());

	it("has data/isLoading", () => {
		const { result } = renderHook(() => useMyBillingPayments("u1"), {
			wrapper: makeWrapper(),
		});
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});
});
