import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeProfessionalAnalytics } from "@/__tests__/fixtures/professional-analytics.fixture";

vi.mock(
	"@/features/analytics/repositories/professional-analytics.repository",
	() => ({
		professionalAnalyticsRepository: { getMine: vi.fn() },
	}),
);

import { professionalAnalyticsRepository } from "@/features/analytics/repositories/professional-analytics.repository";
import { useProfessionalAnalytics } from "./use-professional-analytics";

const mockGetMine = vi.mocked(professionalAnalyticsRepository.getMine);

function makeWrapper() {
	const client = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
	return ({ children }: { children: React.ReactNode }) =>
		createElement(
			QueryClientProvider,
			{ client },
			createElement(Suspense, { fallback: null }, children),
		);
}

describe("useProfessionalAnalytics", () => {
	beforeEach(() => vi.clearAllMocks());

	it("loads the analytics for the requested period", async () => {
		const payload = makeProfessionalAnalytics({ period: "12m" });
		mockGetMine.mockResolvedValueOnce(payload);

		const { result } = renderHook(() => useProfessionalAnalytics("12m"), {
			wrapper: makeWrapper(),
		});

		await waitFor(() => expect(result.current?.data).toEqual(payload));
		expect(mockGetMine).toHaveBeenCalledWith("12m");
	});

	it("fetches again when the period changes", async () => {
		mockGetMine.mockImplementation(async (period) =>
			makeProfessionalAnalytics({ period }),
		);
		const { result, rerender } = renderHook(
			({ period }: { period: "30d" | "90d" }) =>
				useProfessionalAnalytics(period),
			{ wrapper: makeWrapper(), initialProps: { period: "30d" } },
		);
		await waitFor(() => expect(result.current?.data.period).toBe("30d"));

		rerender({ period: "90d" });

		await waitFor(() => expect(result.current?.data.period).toBe("90d"));
		expect(mockGetMine).toHaveBeenNthCalledWith(1, "30d");
		expect(mockGetMine).toHaveBeenNthCalledWith(2, "90d");
	});
});
