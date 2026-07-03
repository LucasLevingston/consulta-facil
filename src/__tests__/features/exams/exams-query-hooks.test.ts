import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/exams/repositories/exams.repository", () => ({
	examsRepository: {
		getAllLabs: vi.fn().mockResolvedValue([]),
		getLabsNearby: vi.fn().mockResolvedValue([]),
		getAvailableSlots: vi.fn().mockResolvedValue([]),
		getMyExams: vi.fn().mockResolvedValue([]),
		getByAppointment: vi.fn().mockResolvedValue([]),
		createRequest: vi.fn().mockResolvedValue({}),
		upload: vi.fn().mockResolvedValue({}),
		review: vi.fn().mockResolvedValue({}),
		scheduleExam: vi.fn().mockResolvedValue({}),
		cancelScheduling: vi.fn().mockResolvedValue(undefined),
	},
}));

import { useAvailableSlots } from "@/features/exams/hooks/use-available-slots";
import { useExamLabs } from "@/features/exams/hooks/use-exam-labs";
import { useExamLabsNearby } from "@/features/exams/hooks/use-exam-labs-nearby";
import { useExamRequestsByAppointment } from "@/features/exams/hooks/use-exam-requests-by-appointment";
import { useMyExams } from "@/features/exams/hooks/use-my-exams";

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useMyExams", () => {
	it("returns data and isLoading", () => {
		const { result } = renderHook(() => useMyExams(), { wrapper: wrapper() });
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
	});
});

describe("useExamLabs", () => {
	it("returns data and isLoading", () => {
		const { result } = renderHook(() => useExamLabs(), { wrapper: wrapper() });
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
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
	it("is disabled when appointmentId is empty", () => {
		const { result } = renderHook(() => useExamRequestsByAppointment(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("is enabled when appointmentId is provided", () => {
		const { result } = renderHook(
			() => useExamRequestsByAppointment("appt-1"),
			{ wrapper: wrapper() },
		);
		expect(result.current.fetchStatus).not.toBe("idle");
	});
});
