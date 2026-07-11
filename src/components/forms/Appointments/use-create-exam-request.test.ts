import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
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
import { useCreateExamRequest } from "./use-create-exam-request";

const mockCreate = vi.mocked(examRequestApi.create);

const examRequest = { id: "exam-1", appointmentId: "a-1", status: "PENDING" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

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
