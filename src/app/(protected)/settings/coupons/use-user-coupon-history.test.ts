import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-coupon.repository", () => ({
	billingCouponRepository: {
		getCouponHistory: vi.fn().mockResolvedValue([]),
	},
}));

import { useUserCouponHistory } from "./use-user-coupon-history";

function makeWrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useUserCouponHistory", () => {
	beforeEach(() => vi.clearAllMocks());

	it("has data/isLoading", () => {
		const { result } = renderHook(() => useUserCouponHistory("u1"), {
			wrapper: makeWrapper(),
		});
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});
});
