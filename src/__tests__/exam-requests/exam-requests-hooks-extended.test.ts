import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/lib/api/examRequest.api", () => ({
	examRequestApi: {
		create: vi.fn(),
		getByAppointment: vi.fn(),
		review: vi.fn(),
		upload: vi.fn(),
	},
}));

import { useCreateExamRequest } from "@/hooks/api/exam-requests/use-create-exam-request";
import { useExamRequestsByAppointment } from "@/hooks/api/exam-requests/use-exam-requests-by-appointment";
import { useReviewExam } from "@/hooks/api/exam-requests/use-review-exam";
import { useUploadExamResult } from "@/hooks/api/exam-requests/use-upload-exam-result";
import { examRequestApi } from "@/lib/api/examRequest.api";

const mockCreate = vi.mocked(examRequestApi.create);
const mockGetByAppointment = vi.mocked(examRequestApi.getByAppointment);
const mockReview = vi.mocked(examRequestApi.review);
const mockUpload = vi.mocked(examRequestApi.upload);

const examRequest = { id: "exam-1", appointmentId: "a-1", status: "PENDING" };

function wrapper() {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return ({ children }: { children: React.ReactNode }) =>
		createElement(QueryClientProvider, { client: qc }, children);
}

describe("useExamRequestsByAppointment", () => {
	beforeEach(() => vi.clearAllMocks());

	it("disabled when appointmentId empty", () => {
		const { result } = renderHook(() => useExamRequestsByAppointment(""), {
			wrapper: wrapper(),
		});
		expect(result.current.fetchStatus).toBe("idle");
	});

	it("fetches when appointmentId provided", async () => {
		mockGetByAppointment.mockResolvedValueOnce([examRequest] as never);
		const { result } = renderHook(() => useExamRequestsByAppointment("a-1"), {
			wrapper: wrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
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

describe("useReviewExam", () => {
	beforeEach(() => vi.clearAllMocks());

	it("calls review with examId and data", async () => {
		mockReview.mockResolvedValueOnce(examRequest as never);
		const { result } = renderHook(() => useReviewExam(), {
			wrapper: wrapper(),
		});
		const data = { status: "APPROVED", notes: "OK" };
		await act(async () => {
			result.current.mutate({ examId: "exam-1", data: data as never });
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(mockReview).toHaveBeenCalledWith("exam-1", data);
	});
});

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
