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
	useAppointmentAnalytics,
	useFinancialAnalytics,
	useUserAnalytics,
} from "@/hooks/api/analytics/use-analytics";
import { analyticsApi } from "@/lib/api/analytics/analytics.api";

const mockFinancial = vi.mocked(analyticsApi.financial);
const mockUsers = vi.mocked(analyticsApi.users);
const mockAppointments = vi.mocked(analyticsApi.appointments);

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useFinancialAnalytics", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches financial analytics", async () => {
		const data = { totalRevenue: 1000 };
		mockFinancial.mockResolvedValueOnce(data as never);
		const { result } = renderHook(() => useFinancialAnalytics(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(data);
	});
});

describe("useUserAnalytics", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches user analytics", async () => {
		const data = { totalUsers: 42 };
		mockUsers.mockResolvedValueOnce(data as never);
		const { result } = renderHook(() => useUserAnalytics(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(data);
	});
});

describe("useAppointmentAnalytics", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches appointment analytics", async () => {
		const data = { totalAppointments: 10 };
		mockAppointments.mockResolvedValueOnce(data as never);
		const { result } = renderHook(() => useAppointmentAnalytics(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(data);
	});
});
