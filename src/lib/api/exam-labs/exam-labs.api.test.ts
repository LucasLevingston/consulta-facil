import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { examLabApi } from "./exam-labs.api";

const mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);
const mockDelete = vi.mocked(api.delete);

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

describe("examLabApi", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("getAll", () => {
		it("chama GET /exam-labs e retorna a lista de laboratórios", async () => {
			mockGet.mockResolvedValueOnce({ data: [examLab] });

			const result = await examLabApi.getAll();

			expect(mockGet).toHaveBeenCalledWith("/exam-labs");
			expect(result).toEqual([examLab]);
		});

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
});
