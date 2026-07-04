import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		delete: vi.fn(),
		patch: vi.fn(),
	},
}));

import { api } from "@/config/api";
import { examLabApi } from "@/lib/api/exam-labs/exam-labs.api";
import { examRequestApi } from "@/lib/api/exam-requests/exam-requests.api";
import { subscriptionsApi } from "@/lib/api/subscriptions/subscriptions.api";
import { createVideoRoomApi } from "@/lib/api/video/create-video-room.api";
import { getVideoRoomTokenApi } from "@/lib/api/video/get-video-room-token.api";

const mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);
const mockPut = vi.mocked(api.put);
const mockDelete = vi.mocked(api.delete);
const mockPatch = vi.mocked(api.patch);

const videoRoom = {
	roomUrl: "https://video.com/room/1",
	token: "token-abc",
	expiresAt: "2026-07-03T12:00:00Z",
};

const examLab = {
	id: "lab-1",
	name: "Laboratório Central",
	description: "Exames laboratoriais",
	phone: "1133334444",
	address: "Rua A, 100",
	city: "São Paulo",
	state: "SP",
	zipCode: "01000-000",
	latitude: -23.5,
	longitude: -46.6,
	imageUrl: null,
	acceptedExams: ["Hemograma"],
	status: "ACTIVE",
	hours: [],
	createdAt: "2026-01-01T00:00:00Z",
};

const scheduling = {
	id: "sched-1",
	examRequestId: "exam-1",
	examName: "Hemograma",
	examLabId: "lab-1",
	examLabName: "Laboratório Central",
	examLabAddress: "Rua A, 100",
	examLabCity: "São Paulo",
	examLabPhone: "1133334444",
	scheduledDate: "2026-07-10",
	scheduledTime: "09:00",
	status: "SCHEDULED" as const,
	notes: null,
	createdAt: "2026-07-03T00:00:00Z",
};

const adminSubscription = {
	id: "sub-1",
	planId: "monthly",
	status: "ACTIVE" as const,
	expiresAt: "2027-05-01T00:00:00Z",
	createdAt: "2026-05-01T00:00:00Z",
	userId: "u-1",
	userEmail: "user@test.com",
	planName: "Mensal",
	ownerType: "PROFESSIONAL" as const,
};

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

describe("createVideoRoomApi", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama POST /appointments/:appointmentId/video-room e retorna a sala criada", async () => {
		mockPost.mockResolvedValueOnce({ data: videoRoom });

		const result = await createVideoRoomApi("apt-1");

		expect(mockPost).toHaveBeenCalledWith("/appointments/apt-1/video-room");
		expect(result).toEqual(videoRoom);
	});

	it("propaga erro 409 quando a sala já existe", async () => {
		const error = Object.assign(new Error("Conflict"), {
			response: { status: 409 },
		});
		mockPost.mockRejectedValueOnce(error);

		await expect(createVideoRoomApi("apt-1")).rejects.toThrow("Conflict");
	});
});

describe("getVideoRoomTokenApi", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama GET /appointments/:appointmentId/video-room/token e retorna o token da sala", async () => {
		mockGet.mockResolvedValueOnce({ data: videoRoom });

		const result = await getVideoRoomTokenApi("apt-1");

		expect(mockGet).toHaveBeenCalledWith(
			"/appointments/apt-1/video-room/token",
		);
		expect(result).toEqual(videoRoom);
	});

	it("propaga erro 404 quando a sala não existe", async () => {
		const error = Object.assign(new Error("Not Found"), {
			response: { status: 404 },
		});
		mockGet.mockRejectedValueOnce(error);

		await expect(getVideoRoomTokenApi("apt-inexistente")).rejects.toThrow(
			"Not Found",
		);
	});
});

describe("examLabApi", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("getAll", () => {
		it("chama GET /exam-labs e retorna a lista de laboratórios", async () => {
			mockGet.mockResolvedValueOnce({ data: [examLab] });

			const result = await examLabApi.getAll();

			expect(mockGet).toHaveBeenCalledWith("/exam-labs");
			expect(result).toEqual([examLab]);
		});
	});

	describe("getById", () => {
		it("chama GET /exam-labs/:id e retorna o laboratório", async () => {
			mockGet.mockResolvedValueOnce({ data: examLab });

			const result = await examLabApi.getById("lab-1");

			expect(mockGet).toHaveBeenCalledWith("/exam-labs/lab-1");
			expect(result).toEqual(examLab);
		});
	});

	describe("getNearby", () => {
		it("chama GET /exam-labs/nearby com lat, lng e radiusKm padrão", async () => {
			mockGet.mockResolvedValueOnce({ data: [examLab] });

			await examLabApi.getNearby(-23.5, -46.6);

			expect(mockGet).toHaveBeenCalledWith("/exam-labs/nearby", {
				params: { lat: -23.5, lng: -46.6, radiusKm: 50 },
			});
		});

		it("permite sobrescrever o radiusKm", async () => {
			mockGet.mockResolvedValueOnce({ data: [] });

			await examLabApi.getNearby(-23.5, -46.6, 10);

			expect(mockGet).toHaveBeenCalledWith("/exam-labs/nearby", {
				params: { lat: -23.5, lng: -46.6, radiusKm: 10 },
			});
		});
	});

	describe("getAvailableSlots", () => {
		it("chama GET /exam-labs/:examLabId/available-slots com a data e retorna os horários", async () => {
			const slots = [{ time: "09:00", available: true }];
			mockGet.mockResolvedValueOnce({ data: slots });

			const result = await examLabApi.getAvailableSlots("lab-1", "2026-07-10");

			expect(mockGet).toHaveBeenCalledWith("/exam-labs/lab-1/available-slots", {
				params: { date: "2026-07-10" },
			});
			expect(result).toEqual(slots);
		});
	});

	describe("scheduleExam", () => {
		it("chama POST /exam-schedulings com os dados e retorna o agendamento criado", async () => {
			mockPost.mockResolvedValueOnce({ data: scheduling });

			const result = await examLabApi.scheduleExam({
				examRequestId: "exam-1",
				examLabId: "lab-1",
				scheduledDate: "2026-07-10",
				scheduledTime: "09:00",
				notes: "Em jejum",
			});

			expect(mockPost).toHaveBeenCalledWith("/exam-schedulings", {
				examRequestId: "exam-1",
				examLabId: "lab-1",
				scheduledDate: "2026-07-10",
				scheduledTime: "09:00",
				notes: "Em jejum",
			});
			expect(result).toEqual(scheduling);
		});
	});

	describe("cancelScheduling", () => {
		it("chama DELETE /exam-schedulings/:schedulingId", async () => {
			mockDelete.mockResolvedValueOnce({ data: undefined });

			await examLabApi.cancelScheduling("sched-1");

			expect(mockDelete).toHaveBeenCalledWith("/exam-schedulings/sched-1");
		});
	});

	describe("getAll — propagação de erro", () => {
		it("propaga erro 500 quando o backend falha", async () => {
			const error = Object.assign(new Error("Internal Server Error"), {
				response: { status: 500 },
			});
			mockGet.mockRejectedValueOnce(error);

			await expect(examLabApi.getAll()).rejects.toThrow(
				"Internal Server Error",
			);
		});
	});
});

describe("subscriptionsApi", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("adminListAll", () => {
		it("chama GET /admin/subscriptions e retorna todas as assinaturas", async () => {
			mockGet.mockResolvedValueOnce({ data: [adminSubscription] });

			const result = await subscriptionsApi.adminListAll();

			expect(mockGet).toHaveBeenCalledWith("/admin/subscriptions");
			expect(result).toEqual([adminSubscription]);
		});

		it("propaga erro 403 quando o usuário não é admin", async () => {
			const error = Object.assign(new Error("Forbidden"), {
				response: { status: 403 },
			});
			mockGet.mockRejectedValueOnce(error);

			await expect(subscriptionsApi.adminListAll()).rejects.toThrow(
				"Forbidden",
			);
		});
	});

	describe("adminCancel", () => {
		it("chama PATCH /admin/subscriptions/:id/cancel", async () => {
			mockPatch.mockResolvedValueOnce({ data: undefined });

			await subscriptionsApi.adminCancel("sub-1");

			expect(mockPatch).toHaveBeenCalledWith(
				"/admin/subscriptions/sub-1/cancel",
			);
		});
	});
});

describe("examRequestApi — getMy e upload", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("getMy", () => {
		it("chama GET /exams/my sem params quando nenhum status é informado", async () => {
			mockGet.mockResolvedValueOnce({ data: [exam] });

			const result = await examRequestApi.getMy();

			expect(mockGet).toHaveBeenCalledWith("/exams/my", { params: {} });
			expect(result).toEqual([exam]);
		});

		it("chama GET /exams/my com o status filtrado quando informado", async () => {
			mockGet.mockResolvedValueOnce({ data: [exam] });

			await examRequestApi.getMy("PENDING");

			expect(mockGet).toHaveBeenCalledWith("/exams/my", {
				params: { status: "PENDING" },
			});
		});
	});

	describe("upload", () => {
		it("chama PUT /exams/:examId/upload com FormData contendo o arquivo", async () => {
			const uploaded = {
				...exam,
				status: "UPLOADED" as const,
				fileUrl: "https://s3.com/exam.pdf",
			};
			mockPut.mockResolvedValueOnce({ data: uploaded });
			const file = new File(["resultado"], "resultado.pdf", {
				type: "application/pdf",
			});

			const result = await examRequestApi.upload("exam-1", file);

			expect(mockPut).toHaveBeenCalledWith(
				"/exams/exam-1/upload",
				expect.any(FormData),
				{ headers: { "Content-Type": "multipart/form-data" } },
			);
			const sentForm = mockPut.mock.calls[0][1] as FormData;
			expect(sentForm.get("file")).toBe(file);
			expect(result.status).toBe("UPLOADED");
		});

		it("propaga erro 400 quando o arquivo enviado é inválido", async () => {
			const error = Object.assign(new Error("Bad Request"), {
				response: { status: 400 },
			});
			mockPut.mockRejectedValueOnce(error);
			const file = new File(["invalido"], "invalido.exe");

			await expect(examRequestApi.upload("exam-1", file)).rejects.toThrow(
				"Bad Request",
			);
		});
	});
});
