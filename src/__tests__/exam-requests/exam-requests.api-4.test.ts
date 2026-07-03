import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { examRequestApi } from "@/lib/api/exam-requests/exam-requests.api";

const mockPut = vi.mocked(api.put);

const exam = {
	id: "exam-1",
	appointmentId: "apt-1",
	professionalId: "prof-1",
	patientId: "pat-1",
	examName: "Raio-X",
	status: "PENDING" as const,
	fileUrl: null,
	professionalNotes: null,
};

describe("examRequestApi — review", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama PUT no examId correto com payload", async () => {
		const reviewed = {
			...exam,
			status: "REVIEWED" as const,
			professionalNotes: "Normal",
		};
		mockPut.mockResolvedValueOnce({ data: reviewed });
		const result = await examRequestApi.review("exam-1", {
			professionalNotes: "Normal",
		});
		expect(mockPut).toHaveBeenCalledWith("/exams/exam-1/review", {
			professionalNotes: "Normal",
		});
		expect(result.status).toBe("REVIEWED");
		expect(result.professionalNotes).toBe("Normal");
	});

	it("IDs de exame diferentes produzem URLs diferentes", async () => {
		mockPut
			.mockResolvedValueOnce({ data: { ...exam, status: "REVIEWED" as const } })
			.mockResolvedValueOnce({
				data: { ...exam, id: "exam-2", status: "REVIEWED" as const },
			});
		await examRequestApi.review("exam-1", { professionalNotes: "Ok" });
		await examRequestApi.review("exam-2", { professionalNotes: "Ok" });
		expect(mockPut.mock.calls[0][0]).toBe("/exams/exam-1/review");
		expect(mockPut.mock.calls[1][0]).toBe("/exams/exam-2/review");
	});
});
