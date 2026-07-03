import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-coupon.repository", () => ({
	billingCouponRepository: {
		adminListCouponUsages: vi.fn().mockResolvedValue([]),
		adminListCoupons: vi.fn().mockResolvedValue([]),
		adminCreateCoupon: vi.fn().mockResolvedValue({}),
		adminUpdateCoupon: vi.fn().mockResolvedValue({}),
		applyCoupon: vi.fn().mockResolvedValue({}),
		getCouponHistory: vi.fn().mockResolvedValue([]),
		validateCoupon: vi.fn().mockResolvedValue({}),
	},
}));

import { useAdminCouponUsages } from "@/features/billing/hooks/use-admin-coupon-usages";
import { useAdminCoupons } from "@/features/billing/hooks/use-admin-coupons";
import { useAdminCreateCoupon } from "@/features/billing/hooks/use-admin-create-coupon";
import { useAdminUpdateCoupon } from "@/features/billing/hooks/use-admin-update-coupon";
import { useApplyCoupon } from "@/features/billing/hooks/use-apply-coupon";
import { useUserCouponHistory } from "@/features/billing/hooks/use-user-coupon-history";
import { useValidateCoupon } from "@/features/billing/hooks/use-validate-coupon";

function makeWrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("billing coupon hooks", () => {
	beforeEach(() => vi.clearAllMocks());

	it("useAdminCouponUsages has data/isLoading", () => {
		const { result } = renderHook(() => useAdminCouponUsages(), {
			wrapper: makeWrapper(),
		});
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});
	it("useAdminCoupons has data/isLoading", () => {
		const { result } = renderHook(() => useAdminCoupons(), {
			wrapper: makeWrapper(),
		});
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});
	it("useUserCouponHistory has data/isLoading", () => {
		const { result } = renderHook(() => useUserCouponHistory("u1"), {
			wrapper: makeWrapper(),
		});
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});
	it("useAdminCreateCoupon has mutate/isPending", () => {
		const { result } = renderHook(() => useAdminCreateCoupon(), {
			wrapper: makeWrapper(),
		});
		expect(typeof result.current.mutate).toBe("function");
		expect(result.current.isPending).toBe(false);
	});
	it("useAdminUpdateCoupon has mutate/isPending", () => {
		const { result } = renderHook(() => useAdminUpdateCoupon(), {
			wrapper: makeWrapper(),
		});
		expect(typeof result.current.mutate).toBe("function");
		expect(result.current.isPending).toBe(false);
	});
	it("useApplyCoupon has mutate/isPending", () => {
		const { result } = renderHook(() => useApplyCoupon(), {
			wrapper: makeWrapper(),
		});
		expect(typeof result.current.mutate).toBe("function");
		expect(result.current.isPending).toBe(false);
	});
	it("useValidateCoupon has mutate/isPending", () => {
		const { result } = renderHook(() => useValidateCoupon(), {
			wrapper: makeWrapper(),
		});
		expect(typeof result.current.mutate).toBe("function");
		expect(result.current.isPending).toBe(false);
	});
});
