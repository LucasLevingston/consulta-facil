import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/billing/coupon.api", () => ({
	couponApi: {
		validate: vi.fn(),
		apply: vi.fn(),
		history: vi.fn(),
		adminListAll: vi.fn(),
		adminListByCoupon: vi.fn(),
		adminListCoupons: vi.fn(),
		adminCreateCoupon: vi.fn(),
		adminUpdateCoupon: vi.fn(),
	},
}));

import { useAdminCouponUsages } from "@/hooks/api/billing/use-admin-coupon-usages";
import { useAdminCoupons } from "@/hooks/api/billing/use-admin-coupons";
import { useAdminCreateCoupon } from "@/hooks/api/billing/use-admin-create-coupon";
import { useAdminUpdateCoupon } from "@/hooks/api/billing/use-admin-update-coupon";
import { useApplyCoupon } from "@/hooks/api/billing/use-apply-coupon";
import { useUserCouponHistory } from "@/hooks/api/billing/use-user-coupon-history";
import { useValidateCoupon } from "@/hooks/api/billing/use-validate-coupon";
import { couponApi } from "@/lib/api/billing/coupon.api";

const mockValidate = vi.mocked(couponApi.validate);
const mockApply = vi.mocked(couponApi.apply);
const mockHistory = vi.mocked(couponApi.history);
const mockAdminListAll = vi.mocked(couponApi.adminListAll);
const mockAdminListCoupons = vi.mocked(couponApi.adminListCoupons);
const mockAdminCreateCoupon = vi.mocked(couponApi.adminCreateCoupon);
const mockAdminUpdateCoupon = vi.mocked(couponApi.adminUpdateCoupon);

const couponUsage = {
	id: "usage-1",
	couponId: "coupon-1",
	userId: "user-1",
	amount: 10,
};

const coupon = {
	id: "coupon-1",
	code: "PROMO10",
	discountPercent: 10,
	active: true,
};

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useAdminCouponUsages", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca todos os usos de cupons administrativos com sucesso", async () => {
		mockAdminListAll.mockResolvedValueOnce([couponUsage] as never);
		const { result } = renderHook(() => useAdminCouponUsages(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual([couponUsage]);
		expect(mockAdminListAll).toHaveBeenCalledTimes(1);
	});
});

describe("useAdminCoupons", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca a lista de cupons administrativos com sucesso", async () => {
		mockAdminListCoupons.mockResolvedValueOnce([coupon] as never);
		const { result } = renderHook(() => useAdminCoupons(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual([coupon]);
		expect(mockAdminListCoupons).toHaveBeenCalledTimes(1);
	});
});

describe("useAdminCreateCoupon", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama adminCreateCoupon com os dados corretos", async () => {
		mockAdminCreateCoupon.mockResolvedValueOnce(coupon as never);
		const { result } = renderHook(() => useAdminCreateCoupon(), {
			wrapper: wrapper(),
		});
		const data = {
			code: "PROMO10",
			discountPercent: 10,
			maxUsesPerUser: 1,
		};
		await act(async () => {
			result.current.mutate(data as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockAdminCreateCoupon.mock.calls[0][0]).toEqual(data);
	});
});

describe("useAdminUpdateCoupon", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama adminUpdateCoupon com id e dados corretos", async () => {
		mockAdminUpdateCoupon.mockResolvedValueOnce(coupon as never);
		const { result } = renderHook(() => useAdminUpdateCoupon(), {
			wrapper: wrapper(),
		});
		const data = { discountPercent: 20 };
		await act(async () => {
			result.current.mutate({ id: "coupon-1", data } as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockAdminUpdateCoupon).toHaveBeenCalledWith("coupon-1", data);
	});
});

describe("useApplyCoupon", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama apply com code, userId, paymentId e amount corretos", async () => {
		mockApply.mockResolvedValueOnce(couponUsage as never);
		const { result } = renderHook(() => useApplyCoupon(), {
			wrapper: wrapper(),
		});
		const input = {
			code: "PROMO10",
			userId: "user-1",
			paymentId: "payment-1",
			amount: 100,
		};
		await act(async () => {
			result.current.mutate(input as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockApply).toHaveBeenCalledWith(
			"PROMO10",
			"user-1",
			"payment-1",
			100,
		);
	});
});

describe("useUserCouponHistory", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fica desabilitado quando userId está vazio", () => {
		const { result } = renderHook(() => useUserCouponHistory(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("busca o histórico quando userId é fornecido", async () => {
		mockHistory.mockResolvedValueOnce([couponUsage] as never);
		const { result } = renderHook(() => useUserCouponHistory("user-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual([couponUsage]);
		expect(mockHistory).toHaveBeenCalledWith("user-1");
	});
});

describe("useValidateCoupon", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama validate com code, userId e amount corretos", async () => {
		const validation = { valid: true, discountAmount: 10 };
		mockValidate.mockResolvedValueOnce(validation as never);
		const { result } = renderHook(() => useValidateCoupon(), {
			wrapper: wrapper(),
		});
		const input = { code: "PROMO10", userId: "user-1", amount: 100 };
		await act(async () => {
			result.current.mutate(input as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockValidate).toHaveBeenCalledWith("PROMO10", "user-1", 100);
	});
});
