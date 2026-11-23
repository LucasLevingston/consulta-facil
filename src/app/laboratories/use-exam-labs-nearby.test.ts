import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, Suspense } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/exam-labs/exam-labs.api", () => ({
	examLabApi: {
		getAll: vi.fn().mockResolvedValue([]),
		getNearby: vi.fn().mockResolvedValue([]),
		getAvailableSlots: vi.fn().mockResolvedValue([]),
	},
}));

import { examLabApi } from "@/lib/api/exam-labs/exam-labs.api";
import { useExamLabsNearby } from "./use-exam-labs-nearby";

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(
			QueryClientProvider,
			{ client: qc },
			createElement(Suspense, { fallback: null }, children),
		);
}

describe("useExamLabsNearby", () => {
	it("fetches nearby labs with given coordinates", async () => {
		vi.mocked(examLabApi.getNearby).mockResolvedValueOnce([] as never);
		const { result } = renderHook(() => useExamLabsNearby(-23.5, -46.6), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
	});

	it("fetches with zero coordinates when no location", async () => {
		vi.mocked(examLabApi.getNearby).mockResolvedValueOnce([] as never);
		const { result } = renderHook(() => useExamLabsNearby(0, 0), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual([]);
	});
});
