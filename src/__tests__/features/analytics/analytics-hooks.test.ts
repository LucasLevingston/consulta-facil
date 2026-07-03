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

import { useAppointmentAnalytics } from "@/features/analytics/hooks/use-appointment-analytics";
import { useFinancialAnalytics } from "@/features/analytics/hooks/use-financial-analytics";
import { useReferralAnalytics } from "@/features/analytics/hooks/use-referral-analytics";
import { useSubscriptionAnalytics } from "@/features/analytics/hooks/use-subscription-analytics";
import { useUserAnalytics } from "@/features/analytics/hooks/use-user-analytics";

function makeWrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(
			QueryClientProvider,
			{ client: qc },
			createElement(Suspense, { fallback: null }, children),
		);
}

describe("analytics query hooks", () => {
	beforeEach(() => vi.clearAllMocks());

	it("useAppointmentAnalytics resolves with data", async () => {
		const { result } = renderHook(() => useAppointmentAnalytics(), {
			wrapper: makeWrapper(),
		});
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(result.current.data).toEqual({});
	});

	it("useFinancialAnalytics resolves with data", async () => {
		const { result } = renderHook(() => useFinancialAnalytics(), {
			wrapper: makeWrapper(),
		});
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(result.current.data).toEqual({});
	});

	it("useReferralAnalytics resolves with data", async () => {
		const { result } = renderHook(() => useReferralAnalytics(), {
			wrapper: makeWrapper(),
		});
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(result.current.data).toEqual({});
	});

	it("useSubscriptionAnalytics resolves with data", async () => {
		const { result } = renderHook(() => useSubscriptionAnalytics(), {
			wrapper: makeWrapper(),
		});
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(result.current.data).toEqual({});
	});

	it("useUserAnalytics resolves with data", async () => {
		const { result } = renderHook(() => useUserAnalytics(), {
			wrapper: makeWrapper(),
		});
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(result.current.data).toEqual({});
	});
});
