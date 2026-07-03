import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { examRequestApi } from "@/lib/api/exam-requests/exam-requests.api";

const mockGet = vi.mocked(api.get);
const _mockPost = vi.mocked(api.post);
const _mockPut = vi.mocked(api.put);

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

describe("examRequestApi — getByAppointment filtro por consulta", () => {
	beforeEach(() => vi.clearAllMocks());

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
