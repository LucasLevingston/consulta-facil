import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, Suspense } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/exam-requests/exam-requests.api", () => ({
	examRequestApi: {
		getMy: vi.fn().mockResolvedValue([]),
		getByAppointment: vi.fn().mockResolvedValue([]),
	},
}));

import { useMyExams } from "./use-my-exams";

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(
			QueryClientProvider,
			{ client: qc },
			createElement(Suspense, { fallback: null }, children),
		);
}

describe("useMyExams", () => {
	it("resolves with data", async () => {
		const { result } = renderHook(() => useMyExams(), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(result.current.data).toEqual([]);
	});
});
