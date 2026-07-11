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

import { useAvailableSlots } from "./use-available-slots";

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useAvailableSlots", () => {
	it("is disabled when examLabId or date is null", () => {
		const { result } = renderHook(() => useAvailableSlots(null, null), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("is enabled when both examLabId and date are provided", () => {
		const { result } = renderHook(
			() => useAvailableSlots("lab-1", "2026-06-10"),
			{ wrapper: wrapper() },
		);
		expect(result.current.fetchStatus).not.toBe("idle");
	});
});
