import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/billing/payment.api", () => ({
	billingPaymentApi: {
		listAll: vi.fn(),
		myPayments: vi.fn(),
		getById: vi.fn(),
	},
}));
vi.mock("@/lib/api/billing/billing-settings.api", () => ({
	billingSettingsApi: { get: vi.fn() },
}));
vi.mock("@/lib/api/billing/commission.api", () => ({
	commissionApi: { adminListAll: vi.fn() },
}));
vi.mock("@/lib/api/billing/fees.api", () => ({
	feesApi: { getConfig: vi.fn() },
}));

import {
	useAdminBillingPayments,
	useBillingPayment,
	useMyBillingPayments,
} from "@/hooks/api/billing/use-billing-payments";
import { useBillingSettings } from "@/hooks/api/billing/use-billing-settings";
import { useAdminCommissions } from "@/hooks/api/billing/use-commissions";
import { useFeeConfig } from "@/hooks/api/billing/use-fee-config";

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useAdminBillingPayments", () => {
	it("returns data and isLoading", () => {
		const { result } = renderHook(() => useAdminBillingPayments(), {
			wrapper: wrapper(),
		});
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});
});

describe("useMyBillingPayments", () => {
	it("disabled when payerId empty", () => {
		const { result } = renderHook(() => useMyBillingPayments(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});
});

describe("useBillingPayment", () => {
	it("disabled when id empty", () => {
		const { result } = renderHook(() => useBillingPayment(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});
});

describe("useBillingSettings", () => {
	it("returns data and isLoading", () => {
		const { result } = renderHook(() => useBillingSettings(), {
			wrapper: wrapper(),
		});
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});
});

describe("useAdminCommissions", () => {
	it("returns data and isLoading", () => {
		const { result } = renderHook(() => useAdminCommissions(), {
			wrapper: wrapper(),
		});
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});
});

describe("useFeeConfig", () => {
	it("returns data and isLoading", () => {
		const { result } = renderHook(() => useFeeConfig(), { wrapper: wrapper() });
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});
});
