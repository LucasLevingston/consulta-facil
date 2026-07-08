import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, Suspense } from "react";
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

function makeWrapper(useSuspense = false) {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(
			QueryClientProvider,
			{ client: qc },
			useSuspense
				? createElement(Suspense, { fallback: null }, children)
				: children,
		);
}

describe("billing plans hooks", () => {
	beforeEach(() => vi.clearAllMocks());

	it("usePlans resolves data", async () => {
		const { result } = renderHook(() => usePlans(), {
			wrapper: makeWrapper(true),
		});
		await waitFor(() => expect(result.current.data).toBeDefined());
	});

	it("useAdminPlans resolves data", async () => {
		const { result } = renderHook(() => useAdminPlans(), {
			wrapper: makeWrapper(true),
		});
		await waitFor(() => expect(result.current.data).toBeDefined());
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
