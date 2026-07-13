import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { examRequestApi } from "./exam-requests.api";

const mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);
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

	it("filtra exames por status disponível", async () => {
		const exams = [
			exam,
			{ ...exam, id: "exam-2", status: "UPLOADED" as const },
			{ ...exam, id: "exam-3", status: "REVIEWED" as const },
		];
		mockGet.mockResolvedValueOnce({ data: exams });

		const result = await examRequestApi.getByAppointment("apt-1");

		const pending = result.filter((e) => e.status === "PENDING");
		const uploaded = result.filter((e) => e.status === "UPLOADED");
		const reviewed = result.filter((e) => e.status === "REVIEWED");
		expect(pending).toHaveLength(1);
		expect(uploaded).toHaveLength(1);
		expect(reviewed).toHaveLength(1);
	});

	it("exame com resultado tem fileUrl preenchido", async () => {
		const examWithFile = {
			...exam,
			id: "exam-2",
			status: "UPLOADED" as const,
			fileUrl: "https://s3.com/exam.pdf",
		};
		mockGet.mockResolvedValueOnce({ data: [exam, examWithFile] });

		const result = await examRequestApi.getByAppointment("apt-1");

		expect(result[0].fileUrl).toBeNull();
		expect(result[1].fileUrl).toBe("https://s3.com/exam.pdf");
	});

	it("exame com notas do profissional tem professionalNotes preenchido", async () => {
		const reviewed = {
			...exam,
			id: "exam-2",
			status: "REVIEWED" as const,
			professionalNotes: "Resultado normal",
		};
		mockGet.mockResolvedValueOnce({ data: [exam, reviewed] });

		const result = await examRequestApi.getByAppointment("apt-1");

		expect(result[0].professionalNotes).toBeNull();
		expect(result[1].professionalNotes).toBe("Resultado normal");
	});
});

// ── create ────────────────────────────────────────────────────────────────────

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

// ── review ────────────────────────────────────────────────────────────────────

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
