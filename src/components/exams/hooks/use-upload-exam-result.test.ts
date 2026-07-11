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
import { useUploadExamResult } from "./use-upload-exam-result";

const mockUpload = vi.mocked(examRequestApi.upload);

const examRequest = { id: "exam-1", appointmentId: "a-1", status: "PENDING" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useUploadExamResult", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls upload with examId and file", async () => {
		mockUpload.mockResolvedValueOnce(examRequest as never);
		const { result } = renderHook(() => useUploadExamResult(), {
			wrapper: wrapper(),
		});
		const file = new File(["content"], "result.pdf", {
			type: "application/pdf",
		});
		await act(async () => {
			result.current.mutate({ examId: "exam-1", file });
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockUpload).toHaveBeenCalledWith("exam-1", file);
	});
});
