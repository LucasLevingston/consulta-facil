import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
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

import { useAppointmentAnalytics } from "@/features/analytics/hooks/use-appointment-analytics";
import { useFinancialAnalytics } from "@/features/analytics/hooks/use-financial-analytics";
import { useReferralAnalytics } from "@/features/analytics/hooks/use-referral-analytics";
import { useSubscriptionAnalytics } from "@/features/analytics/hooks/use-subscription-analytics";
import { useUserAnalytics } from "@/features/analytics/hooks/use-user-analytics";

function makeWrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("analytics query hooks", () => {
	beforeEach(() => vi.clearAllMocks());

	it("useAppointmentAnalytics returns data and isLoading", () => {
		const { result } = renderHook(() => useAppointmentAnalytics(), {
			wrapper: makeWrapper(),
		});
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});

	it("useFinancialAnalytics returns data and isLoading", () => {
		const { result } = renderHook(() => useFinancialAnalytics(), {
			wrapper: makeWrapper(),
		});
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});

	it("useReferralAnalytics returns data and isLoading", () => {
		const { result } = renderHook(() => useReferralAnalytics(), {
			wrapper: makeWrapper(),
		});
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});

	it("useSubscriptionAnalytics returns data and isLoading", () => {
		const { result } = renderHook(() => useSubscriptionAnalytics(), {
			wrapper: makeWrapper(),
		});
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});

	it("useUserAnalytics returns data and isLoading", () => {
		const { result } = renderHook(() => useUserAnalytics(), {
			wrapper: makeWrapper(),
		});
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});
});
