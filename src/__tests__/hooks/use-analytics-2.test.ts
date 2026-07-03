import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/analytics/analytics.api", () => ({
	analyticsApi: {
		financial: vi.fn(),
		users: vi.fn(),
		appointments: vi.fn(),
		referrals: vi.fn(),
		subscriptions: vi.fn(),
	},
}));

import {
	useReferralAnalytics,
	useSubscriptionAnalytics,
} from "@/hooks/api/analytics/use-analytics";
import { analyticsApi } from "@/lib/api/analytics/analytics.api";

const mockReferrals = vi.mocked(analyticsApi.referrals);
const mockSubscriptions = vi.mocked(analyticsApi.subscriptions);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useReferralAnalytics", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches referral analytics", async () => {
		const data = { totalReferrals: 5 };
		mockReferrals.mockResolvedValueOnce(data as never);
		const { result } = renderHook(() => useReferralAnalytics(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(data);
	});
});

describe("useSubscriptionAnalytics", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches subscription analytics", async () => {
		const data = { totalSubscriptions: 3 };
		mockSubscriptions.mockResolvedValueOnce(data as never);
		const { result } = renderHook(() => useSubscriptionAnalytics(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(data);
	});
});
