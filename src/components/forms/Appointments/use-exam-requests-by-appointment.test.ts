import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/exam-requests/exam-requests.api", () => ({
	examRequestApi: {
		create: vi.fn(),
		getByAppointment: vi.fn(),
		review: vi.fn(),
		upload: vi.fn(),
	},
}));

import { examRequestApi } from "@/lib/api/exam-requests/exam-requests.api";
import { useExamRequestsByAppointment } from "./use-exam-requests-by-appointment";

const mockGetByAppointment = vi.mocked(examRequestApi.getByAppointment);

const examRequest = { id: "exam-1", appointmentId: "a-1", status: "PENDING" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(
			QueryClientProvider,
			{ client: qc },
			createElement(Suspense, { fallback: null }, children),
		);
}

describe("useExamRequestsByAppointment", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches when appointmentId provided", async () => {
		mockGetByAppointment.mockResolvedValueOnce([examRequest] as never);
		const { result } = renderHook(() => useExamRequestsByAppointment("a-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(result.current.data).toHaveLength(1);
	});
});
