import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { examRequestApi } from "@/lib/api/exam-requests/exam-requests.api";

const mockGet = vi.mocked(api.get);

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

// ── getByAppointment ──────────────────────────────────────────────────────────

describe("examRequestApi — getByAppointment filtro por consulta", () => {
	beforeEach(() => vi.clearAllMocks());

	it("passa appointmentId correto na URL", async () => {
		mockGet.mockResolvedValueOnce({ data: [exam] });

		await examRequestApi.getByAppointment("apt-1");

		expect(mockGet).toHaveBeenCalledWith("/appointments/apt-1/exams");
	});

	it("IDs de consulta diferentes produzem URLs diferentes", async () => {
		mockGet
			.mockResolvedValueOnce({ data: [exam] })
			.mockResolvedValueOnce({ data: [] });

		await examRequestApi.getByAppointment("apt-1");
		await examRequestApi.getByAppointment("apt-2");

		expect(mockGet.mock.calls[0][0]).toBe("/appointments/apt-1/exams");
		expect(mockGet.mock.calls[1][0]).toBe("/appointments/apt-2/exams");
	});

	it("retorna todos os exames da consulta", async () => {
		const exams = [
			exam,
			{ ...exam, id: "exam-2", examName: "Ultrassom" },
			{ ...exam, id: "exam-3", examName: "Hemograma" },
		];
		mockGet.mockResolvedValueOnce({ data: exams });

		const result = await examRequestApi.getByAppointment("apt-1");

		expect(result).toHaveLength(3);
		expect(result.map((e) => e.examName)).toEqual([
			"Raio-X",
			"Ultrassom",
			"Hemograma",
		]);
	});

	it("consulta sem exames retorna array vazio", async () => {
		mockGet.mockResolvedValueOnce({ data: [] });

		const result = await examRequestApi.getByAppointment("apt-sem-exames");

		expect(result).toEqual([]);
	});
});
