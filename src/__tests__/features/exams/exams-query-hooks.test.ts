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
vi.mock("@/lib/api/exam-requests/exam-requests.api", () => ({
	examRequestApi: {
		getMy: vi.fn().mockResolvedValue([]),
		getByAppointment: vi.fn().mockResolvedValue([]),
	},
}));

import { useAvailableSlots } from "@/features/exams/hooks/use-available-slots";
import { useExamLabs } from "@/features/exams/hooks/use-exam-labs";
import { useExamLabsNearby } from "@/features/exams/hooks/use-exam-labs-nearby";
import { useExamRequestsByAppointment } from "@/features/exams/hooks/use-exam-requests-by-appointment";
import { useMyExams } from "@/features/exams/hooks/use-my-exams";

function wrapper(useSuspense = false) {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(
			QueryClientProvider,
			{ client: qc },
			useSuspense
				? createElement(Suspense, { fallback: null }, children)
				: children,
		);
}

describe("useMyExams", () => {
	it("resolves with data", async () => {
		const { result } = renderHook(() => useMyExams(), {
			wrapper: wrapper(true),
		});
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(result.current.data).toEqual([]);
	});
});

describe("useExamLabs", () => {
	it("resolves with data", async () => {
		const { result } = renderHook(() => useExamLabs(), {
			wrapper: wrapper(true),
		});
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(result.current.data).toEqual([]);
	});
});

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

describe("useExamRequestsByAppointment", () => {
	it("resolves with data for the given appointment", async () => {
		const { result } = renderHook(
			() => useExamRequestsByAppointment("appt-1"),
			{ wrapper: wrapper(true) },
		);
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(result.current.data).toEqual([]);
	});
});
