import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { appointmentKeys } from "@/hooks/api/use-appointments";
import { appointmentsApi } from "@/lib/api/appointments.api";

const mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);
const mockPut = vi.mocked(api.put);
const mockDelete = vi.mocked(api.delete);

const appointment = {
	id: "a-1",
	patientId: "p-1",
	professionalId: "d-1",
	scheduledAt: "2026-05-20T10:00:00Z",
	status: "PENDING" as const,
};

const page = {
	content: [appointment],
	totalElements: 1,
	totalPages: 1,
	number: 0,
};

describe("appointmentsApi", () => {
	beforeEach(() => vi.clearAllMocks());

	it("getByPatient — chama GET /appointments/patient/:id com paginação", async () => {
		mockGet.mockResolvedValueOnce({ data: page });

		const result = await appointmentsApi.getByPatient("p-1", 0, 10);

		expect(mockGet).toHaveBeenCalledWith("/appointments/patient/p-1", {
			params: { page: 0, size: 10 },
		});
		expect(result.content).toHaveLength(1);
	});

	it("getById — chama GET /appointments/:id e retorna a consulta", async () => {
		mockGet.mockResolvedValueOnce({ data: appointment });

		const result = await appointmentsApi.getById("a-1");

		expect(mockGet).toHaveBeenCalledWith("/appointments/a-1");
		expect(result.id).toBe("a-1");
		expect(result.status).toBe("PENDING");
	});

	it("getByProfessional — chama GET /appointments/professional/:id com paginação", async () => {
		mockGet.mockResolvedValueOnce({ data: page });

		const result = await appointmentsApi.getByProfessional("d-1", 0, 20);

		expect(mockGet).toHaveBeenCalledWith("/appointments/professional/d-1", {
			params: { page: 0, size: 20 },
		});
		expect(result.totalElements).toBe(1);
	});

	it("schedule — chama POST /appointments e retorna a consulta criada", async () => {
		mockPost.mockResolvedValueOnce({ data: appointment });

		const result = await appointmentsApi.schedule({
			professionalId: "d-1",
			scheduledAt: "2026-05-20T10:00:00Z",
		});

		expect(mockPost).toHaveBeenCalledWith(
			"/appointments",
			expect.objectContaining({ professionalId: "d-1" }),
		);
		expect(result.status).toBe("PENDING");
	});

	it("confirm — chama PUT /appointments/:id/confirm e retorna confirmada", async () => {
		const confirmed = { ...appointment, status: "CONFIRMED" as const };
		mockPut.mockResolvedValueOnce({ data: confirmed });

		const result = await appointmentsApi.confirm("a-1");

		expect(mockPut).toHaveBeenCalledWith("/appointments/a-1/confirm");
		expect(result.status).toBe("CONFIRMED");
	});

	it("cancel — chama PUT /appointments/:id/cancel com o motivo", async () => {
		const canceled = { ...appointment, status: "CANCELED" as const };
		mockPut.mockResolvedValueOnce({ data: canceled });

		const result = await appointmentsApi.cancel("a-1", {
			cancellationReason: "Viagem",
		});

		expect(mockPut).toHaveBeenCalledWith("/appointments/a-1/cancel", {
			cancellationReason: "Viagem",
		});
		expect(result.status).toBe("CANCELED");
	});

	it("complete — chama PUT /appointments/:id/complete e retorna concluída", async () => {
		const completed = { ...appointment, status: "COMPLETED" as const };
		mockPut.mockResolvedValueOnce({ data: completed });

		const result = await appointmentsApi.complete("a-1");

		expect(mockPut).toHaveBeenCalledWith("/appointments/a-1/complete");
		expect(result.status).toBe("COMPLETED");
	});

	it("delete — chama DELETE /appointments/:id", async () => {
		mockDelete.mockResolvedValueOnce({ data: undefined });

		await appointmentsApi.delete("a-1");

		expect(mockDelete).toHaveBeenCalledWith("/appointments/a-1");
	});
});

describe("appointmentKeys", () => {
	it("byPatient gera a query key correta", () => {
		expect(appointmentKeys.byPatient("p-1")).toEqual([
			"appointments",
			"patient",
			"p-1",
		]);
	});

	it("byProfessional gera a query key correta", () => {
		expect(appointmentKeys.byProfessional("d-1")).toEqual([
			"appointments",
			"professional",
			"d-1",
		]);
	});

	it("detail gera a query key correta", () => {
		expect(appointmentKeys.detail("a-1")).toEqual(["appointments", "a-1"]);
	});
});
