import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
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

import { useCreateExamRequest } from "@/hooks/api/exam-requests/use-create-exam-request";
import { useExamRequestsByAppointment } from "@/hooks/api/exam-requests/use-exam-requests-by-appointment";
import { examRequestApi } from "@/lib/api/exam-requests/exam-requests.api";

const mockCreate = vi.mocked(examRequestApi.create);
const mockGetByAppointment = vi.mocked(examRequestApi.getByAppointment);

const examRequest = { id: "exam-1", appointmentId: "a-1", status: "PENDING" };

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

describe("useExamRequestsByAppointment", () => {
	beforeEach(() => vi.clearAllMocks());

	it("fetches when appointmentId provided", async () => {
		mockGetByAppointment.mockResolvedValueOnce([examRequest] as never);
		const { result } = renderHook(() => useExamRequestsByAppointment("a-1"), {
			wrapper: wrapper(true),
		});
		await waitFor(() => expect(result.current).not.toBeNull());
		expect(result.current.data).toHaveLength(1);
	});
});

describe("useCreateExamRequest", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls create with appointmentId and data", async () => {
		mockCreate.mockResolvedValueOnce(examRequest as never);
		const { result } = renderHook(() => useCreateExamRequest("a-1"), {
			wrapper: wrapper(),
		});
		const data = { type: "BLOOD_TEST", description: "Hemograma" };
		await act(async () => {
			result.current.mutate(data as never);
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockCreate).toHaveBeenCalledWith("a-1", data);
	});
});
