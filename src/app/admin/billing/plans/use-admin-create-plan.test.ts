import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-plans.repository", () => ({
	billingPlansRepository: {
		adminCreatePlan: vi.fn().mockResolvedValue({}),
	},
}));

import { useAdminCreatePlan } from "./use-admin-create-plan";

function makeWrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useAdminCreatePlan", () => {
	beforeEach(() => vi.clearAllMocks());

	it("has mutate/isPending", () => {
		const { result } = renderHook(() => useAdminCreatePlan(), {
			wrapper: makeWrapper(),
		});
		expect(typeof result.current.mutate).toBe("function");
		expect(result.current.isPending).toBe(false);
	});
});
