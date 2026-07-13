import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { appointmentLifecycleApi } from "./appointment-lifecycle.api";

const mockPut = vi.mocked(api.put);

const appointment = {
	id: "a-1",
	patientId: "p-1",
	professionalId: "d-1",
	scheduledAt: "2026-05-20T10:00:00Z",
	status: "PENDING" as const,
};

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
