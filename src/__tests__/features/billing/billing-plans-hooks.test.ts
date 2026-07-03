import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-plans.repository", () => ({
	billingPlansRepository: {
		getActivePlans: vi.fn().mockResolvedValue([]),
		adminListPlans: vi.fn().mockResolvedValue([]),
		adminCreatePlan: vi.fn().mockResolvedValue({}),
		adminDeactivatePlan: vi.fn().mockResolvedValue(undefined),
	},
}));

import { useAdminCreatePlan } from "@/features/billing/hooks/use-admin-create-plan";
import { useAdminDeactivatePlan } from "@/features/billing/hooks/use-admin-deactivate-plan";
import { useAdminPlans } from "@/features/billing/hooks/use-admin-plans";
import { usePlans } from "@/features/billing/hooks/use-plans";

function makeWrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("billing plans hooks", () => {
	beforeEach(() => vi.clearAllMocks());

	it("usePlans has data/isLoading", () => {
		const { result } = renderHook(() => usePlans(), { wrapper: makeWrapper() });
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});

	it("useAdminPlans has data/isLoading", () => {
		const { result } = renderHook(() => useAdminPlans(), {
			wrapper: makeWrapper(),
		});
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});

	it("useAdminCreatePlan has mutate/isPending", () => {
		const { result } = renderHook(() => useAdminCreatePlan(), {
			wrapper: makeWrapper(),
		});
		expect(typeof result.current.mutate).toBe("function");
		expect(result.current.isPending).toBe(false);
	});

	it("useAdminDeactivatePlan has mutate/isPending", () => {
		const { result } = renderHook(() => useAdminDeactivatePlan(), {
			wrapper: makeWrapper(),
		});
		expect(typeof result.current.mutate).toBe("function");
		expect(result.current.isPending).toBe(false);
	});
});
