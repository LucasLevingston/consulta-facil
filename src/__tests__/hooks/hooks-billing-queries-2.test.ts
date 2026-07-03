import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/billing/feature.api", () => ({
	featureApi: { listAll: vi.fn() },
}));
vi.mock("@/lib/api/billing/invoice.api", () => ({
	invoiceApi: {
		listMine: vi.fn(),
		listAll: vi.fn(),
		getById: vi.fn(),
		getByPaymentId: vi.fn(),
	},
}));
vi.mock("@/lib/api/billing/plans.api", () => ({
	plansApi: { getActive: vi.fn(), adminListAll: vi.fn() },
}));

import { useFeatures } from "@/hooks/api/billing/use-features";
import {
	useAdminInvoices,
	useInvoice,
	useMyInvoices,
} from "@/hooks/api/billing/use-invoices";
import { useAdminPlans, usePlans } from "@/hooks/api/billing/use-plans";

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useFeatures", () => {
	it("returns data and isLoading", () => {
		const { result } = renderHook(() => useFeatures(), { wrapper: wrapper() });
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});
});

describe("useMyInvoices", () => {
	it("returns data and isLoading", () => {
		const { result } = renderHook(() => useMyInvoices(), {
			wrapper: wrapper(),
		});
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});
});

describe("useAdminInvoices", () => {
	it("returns data and isLoading", () => {
		const { result } = renderHook(() => useAdminInvoices(), {
			wrapper: wrapper(),
		});
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});
});

describe("useInvoice", () => {
	it("disabled when id empty", () => {
		const { result } = renderHook(() => useInvoice(""), { wrapper: wrapper() });
		expect(result.current.fetchStatus).toBe("idle");
	});
});

describe("usePlans", () => {
	it("returns data and isLoading", () => {
		const { result } = renderHook(() => usePlans(), { wrapper: wrapper() });
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});
});

describe("useAdminPlans", () => {
	it("returns data and isLoading", () => {
		const { result } = renderHook(() => useAdminPlans(), {
			wrapper: wrapper(),
		});
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});
});
