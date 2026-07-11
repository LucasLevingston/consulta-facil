import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/exam-labs/exam-labs.api", () => ({
	examLabApi: {
		getAll: vi.fn().mockResolvedValue([]),
		getNearby: vi.fn().mockResolvedValue([]),
		getAvailableSlots: vi.fn().mockResolvedValue([]),
	},
}));

import { useExamLabsNearby } from "./use-exam-labs-nearby";

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useExamLabsNearby", () => {
	it("is disabled when lat or lng is null", () => {
		const { result } = renderHook(() => useExamLabsNearby(null, null), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("is enabled when lat and lng are provided", () => {
		const { result } = renderHook(() => useExamLabsNearby(-23.5, -46.6), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).not.toBe("idle");
	});
});
