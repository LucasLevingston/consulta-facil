import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-coupon.repository", () => ({
	billingCouponRepository: {
		adminListCouponUsages: vi.fn().mockResolvedValue([]),
	},
}));

import { useAdminCouponUsages } from "./use-admin-coupon-usages";

function makeWrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(
			QueryClientProvider,
			{ client: qc },
			createElement(Suspense, { fallback: null }, children),
		);
}

describe("useAdminCouponUsages", () => {
	beforeEach(() => vi.clearAllMocks());

	it("resolves data", async () => {
		const { result } = renderHook(() => useAdminCouponUsages(), {
			wrapper: makeWrapper(),
		});
		await waitFor(() => expect(result.current.data).toBeDefined());
	});
});
