import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { appointmentKeys } from "@/hooks/api/appointments/appointment-keys";
import { appointmentLifecycleApi } from "@/lib/api/appointments/appointment-lifecycle.api";
import { appointmentsCrudApi } from "@/lib/api/appointments/appointments.api";

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

describe("appointmentsCrudApi", () => {
	beforeEach(() => vi.clearAllMocks());

	it("getByPatient — chama GET /appointments/patient/:id com paginação", async () => {
		mockGet.mockResolvedValueOnce({ data: page });

		const result = await appointmentsCrudApi.getByPatient("p-1", 0, 10);

		expect(mockGet).toHaveBeenCalledWith("/appointments/patient/p-1", {
			params: { page: 0, size: 10 },
		});
		expect(result.content).toHaveLength(1);
	});

	it("getById — chama GET /appointments/:id e retorna a consulta", async () => {
		mockGet.mockResolvedValueOnce({ data: appointment });

		const result = await appointmentsCrudApi.getById("a-1");

		expect(mockGet).toHaveBeenCalledWith("/appointments/a-1");
		expect(result.id).toBe("a-1");
		expect(result.status).toBe("PENDING");
	});

	it("getByProfessional — chama GET /appointments/professional/:id com paginação", async () => {
		mockGet.mockResolvedValueOnce({ data: page });

		const result = await appointmentsCrudApi.getByProfessional("d-1", 0, 20);

		expect(mockGet).toHaveBeenCalledWith("/appointments/professional/d-1", {
			params: { page: 0, size: 20 },
		});
		expect(result.totalElements).toBe(1);
	});

	it("schedule — chama POST /appointments e retorna a consulta criada", async () => {
		mockPost.mockResolvedValueOnce({ data: appointment });

		const result = await appointmentsCrudApi.schedule({
			professionalId: "d-1",
			scheduledAt: "2026-05-20T10:00:00Z",
		});

		expect(mockPost).toHaveBeenCalledWith(
			"/appointments",
			expect.objectContaining({ professionalId: "d-1" }),
		);
		expect(result.status).toBe("PENDING");
	});

	it("reschedule — chama PUT /appointments/:id/reschedule com nova data e razão", async () => {
		const rescheduled = {
			...appointment,
			scheduledAt: "2026-06-01T10:00:00Z",
			previousScheduledAt: "2026-05-20T10:00:00Z",
		};
		mockPut.mockResolvedValueOnce({ data: rescheduled });

		const newDate = new Date("2026-06-01T10:00:00Z");
		const result = await appointmentsCrudApi.reschedule("a-1", {
			scheduledAt: newDate,
			reason: "Mudança de agenda",
		});

		expect(mockPut).toHaveBeenCalledWith(
			"/appointments/a-1/reschedule",
			expect.objectContaining({
				scheduledAt: newDate.toISOString(),
				reason: "Mudança de agenda",
			}),
		);
		expect(result.previousScheduledAt).toBe("2026-05-20T10:00:00Z");
	});

	it("delete — chama DELETE /appointments/:id", async () => {
		mockDelete.mockResolvedValueOnce({ data: undefined });

		await appointmentsCrudApi.delete("a-1");

		expect(mockDelete).toHaveBeenCalledWith("/appointments/a-1");
	});
});

describe("appointmentLifecycleApi", () => {
	beforeEach(() => vi.clearAllMocks());

	it("confirm — chama PUT /appointments/:id/confirm e retorna confirmada", async () => {
		const confirmed = { ...appointment, status: "CONFIRMED" as const };
		mockPut.mockResolvedValueOnce({ data: confirmed });

		const result = await appointmentLifecycleApi.confirm("a-1");

		expect(mockPut).toHaveBeenCalledWith("/appointments/a-1/confirm");
		expect(result.status).toBe("CONFIRMED");
	});

	it("cancel — chama PUT /appointments/:id/cancel com o motivo", async () => {
		const canceled = { ...appointment, status: "CANCELED" as const };
		mockPut.mockResolvedValueOnce({ data: canceled });

		const result = await appointmentLifecycleApi.cancel("a-1", {
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

		const result = await appointmentLifecycleApi.complete("a-1");

		expect(mockPut).toHaveBeenCalledWith("/appointments/a-1/complete");
		expect(result.status).toBe("COMPLETED");
	});

	it("setModality — chama PUT /appointments/:id/modality com ONLINE", async () => {
		const online = {
			...appointment,
			modality: "ONLINE" as const,
			meetLink: "https://meet.google.com/abc",
		};
		mockPut.mockResolvedValueOnce({ data: online });

		const result = await appointmentLifecycleApi.setModality("a-1", {
			modality: "ONLINE",
		});

		expect(mockPut).toHaveBeenCalledWith("/appointments/a-1/modality", {
			modality: "ONLINE",
		});
		expect(result.modality).toBe("ONLINE");
	});

	it("setModality — chama PUT com IN_PERSON", async () => {
		const inPerson = { ...appointment, modality: "IN_PERSON" as const };
		mockPut.mockResolvedValueOnce({ data: inPerson });

		await appointmentLifecycleApi.setModality("a-1", { modality: "IN_PERSON" });

		expect(mockPut).toHaveBeenCalledWith("/appointments/a-1/modality", {
			modality: "IN_PERSON",
		});
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
