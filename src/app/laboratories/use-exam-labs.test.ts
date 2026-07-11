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

import { useExamLabs } from "./use-exam-labs";

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(
			QueryClientProvider,
			{ client: qc },
			createElement(Suspense, { fallback: null }, children),
		);
}

describe("useExamLabs", () => {
	it("resolves with data", async () => {
		const { result } = renderHook(() => useExamLabs(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(result.current.data).toEqual([]);
	});
});
