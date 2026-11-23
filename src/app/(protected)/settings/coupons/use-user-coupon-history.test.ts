import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, Suspense } from "react";
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
		createElement(
			QueryClientProvider,
			{ client: qc },
			createElement(Suspense, { fallback: null }, children),
		);
}

describe("useUserCouponHistory", () => {
	beforeEach(() => vi.clearAllMocks());

	it("resolves with data after fetching", async () => {
		const { result } = renderHook(() => useUserCouponHistory("u1"), {
			wrapper: makeWrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current).toHaveProperty("data");
	});
});
