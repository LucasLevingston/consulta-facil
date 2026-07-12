import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-coupon.repository", () => ({
	billingCouponRepository: {
		adminCreateCoupon: vi.fn().mockResolvedValue({}),
	},
}));

import { useAdminCreateCoupon } from "./use-admin-create-coupon";

function makeWrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useAdminCreateCoupon", () => {
	beforeEach(() => vi.clearAllMocks());

	it("has mutate/isPending", () => {
		const { result } = renderHook(() => useAdminCreateCoupon(), {
			wrapper: makeWrapper(),
		});
		expect(typeof result.current.mutate).toBe("function");
		expect(result.current.isPending).toBe(false);
	});
});
