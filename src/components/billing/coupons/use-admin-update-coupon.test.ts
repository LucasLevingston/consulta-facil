import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-coupon.repository", () => ({
	billingCouponRepository: {
		adminUpdateCoupon: vi.fn().mockResolvedValue({}),
	},
}));

import { useAdminUpdateCoupon } from "./use-admin-update-coupon";

function makeWrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useAdminUpdateCoupon", () => {
	beforeEach(() => vi.clearAllMocks());

	it("has mutate/isPending", () => {
		const { result } = renderHook(() => useAdminUpdateCoupon(), {
			wrapper: makeWrapper(),
		});
		expect(typeof result.current.mutate).toBe("function");
		expect(result.current.isPending).toBe(false);
	});
});
