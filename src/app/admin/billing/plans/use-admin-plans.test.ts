import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/billing/repositories/billing-plans.repository", () => ({
	billingPlansRepository: {
		adminListPlans: vi.fn().mockResolvedValue([]),
	},
}));

import { useAdminPlans } from "./use-admin-plans";

function makeWrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(
			QueryClientProvider,
			{ client: qc },
			createElement(Suspense, { fallback: null }, children),
		);
}

describe("useAdminPlans", () => {
	beforeEach(() => vi.clearAllMocks());

	it("resolves data", async () => {
		const { result } = renderHook(() => useAdminPlans(), {
			wrapper: makeWrapper(),
		});
		await waitFor(() => expect(result.current.data).toBeDefined());
	});
});
