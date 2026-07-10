import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/analytics/repositories/analytics.repository", () => ({
	analyticsRepository: {
		getAppointments: vi.fn().mockResolvedValue({}),
		getFinancial: vi.fn().mockResolvedValue({}),
		getReferrals: vi.fn().mockResolvedValue({}),
		getSubscriptions: vi.fn().mockResolvedValue({}),
		getUsers: vi.fn().mockResolvedValue({}),
	},
}));

import { useUserAnalytics } from "./use-user-analytics";

function makeWrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(
			QueryClientProvider,
			{ client: qc },
			createElement(Suspense, { fallback: null }, children),
		);
}

describe("useUserAnalytics", () => {
	beforeEach(() => vi.clearAllMocks());

	it("resolves with data", async () => {
		const { result } = renderHook(() => useUserAnalytics(), {
			wrapper: makeWrapper(),
		});
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(result.current.data).toEqual({});
	});
});
