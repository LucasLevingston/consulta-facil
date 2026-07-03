import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { examRequestApi } from "@/lib/api/exam-requests/exam-requests.api";

const mockPost = vi.mocked(api.post);

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

describe("examRequestApi — create", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama POST no appointmentId correto com payload", async () => {
		mockPost.mockResolvedValueOnce({ data: exam });
		await examRequestApi.create("apt-1", {
			examName: "Raio-X",
			instructions: "Em jejum",
		});
		expect(mockPost).toHaveBeenCalledWith("/appointments/apt-1/exams", {
			examName: "Raio-X",
			instructions: "Em jejum",
		});
	});

	it("IDs de consulta diferentes produzem URLs diferentes", async () => {
		mockPost
			.mockResolvedValueOnce({ data: exam })
			.mockResolvedValueOnce({ data: { ...exam, id: "exam-2" } });
		await examRequestApi.create("apt-1", { examName: "Raio-X" });
		await examRequestApi.create("apt-2", { examName: "Raio-X" });
		expect(mockPost.mock.calls[0][0]).toBe("/appointments/apt-1/exams");
		expect(mockPost.mock.calls[1][0]).toBe("/appointments/apt-2/exams");
	});

	it("retorna exame criado com status PENDING", async () => {
		mockPost.mockResolvedValueOnce({ data: exam });
		const result = await examRequestApi.create("apt-1", {
			examName: "Hemograma",
		});
		expect(result.status).toBe("PENDING");
		expect(result.fileUrl).toBeNull();
	});
});
