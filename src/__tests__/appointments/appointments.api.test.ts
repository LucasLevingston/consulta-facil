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

	it("reschedule — chama PUT /appointments/:id/reschedule com nova data e razão", async () => {
		const rescheduled = {
			...appointment,
			scheduledAt: "2026-06-01T10:00:00Z",
			previousScheduledAt: "2026-05-20T10:00:00Z",
		};
		mockPut.mockResolvedValueOnce({ data: rescheduled });

		const newDate = new Date("2026-06-01T10:00:00Z");
		const result = await appointmentsApi.reschedule("a-1", {
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

		await appointmentsApi.delete("a-1");

		expect(mockDelete).toHaveBeenCalledWith("/appointments/a-1");
	});
});

describe("appointmentsApi — funcionalidades avançadas", () => {
	beforeEach(() => vi.clearAllMocks());

	// rate
	it("rate — chama POST /appointments/:id/rate com stars e comment", async () => {
		const rated = {
			...appointment,
			rating: 5,
			ratingComment: "Ótimo atendimento",
		};
		mockPost.mockResolvedValueOnce({ data: rated });

		const result = await appointmentsApi.rate("a-1", {
			stars: 5,
			comment: "Ótimo atendimento",
		});

		expect(mockPost).toHaveBeenCalledWith("/appointments/a-1/rate", {
			stars: 5,
			comment: "Ótimo atendimento",
		});
		expect(result.rating).toBe(5);
	});

	it("rate — aceita rating mínimo 1 e comentário opcional", async () => {
		mockPost.mockResolvedValueOnce({ data: { ...appointment, rating: 1 } });

		await appointmentsApi.rate("a-1", { stars: 1 });

		expect(mockPost).toHaveBeenCalledWith("/appointments/a-1/rate", {
			stars: 1,
		});
	});

	// getCheckInToken
	it("getCheckInToken — chama GET /appointments/:id/checkin-token e retorna token", async () => {
		const token = { appointmentId: "a-1", token: "TOKEN-XYZ-123" };
		mockGet.mockResolvedValueOnce({ data: token });

		const result = await appointmentsApi.getCheckInToken("a-1");

		expect(mockGet).toHaveBeenCalledWith("/appointments/a-1/checkin-token");
		expect(result.token).toBe("TOKEN-XYZ-123");
		expect(result.appointmentId).toBe("a-1");
	});

	it("getCheckInToken — IDs diferentes produzem URLs diferentes", async () => {
		mockGet
			.mockResolvedValueOnce({ data: { appointmentId: "a-1", token: "T1" } })
			.mockResolvedValueOnce({ data: { appointmentId: "a-2", token: "T2" } });

		await appointmentsApi.getCheckInToken("a-1");
		await appointmentsApi.getCheckInToken("a-2");

		expect(mockGet.mock.calls[0][0]).toBe("/appointments/a-1/checkin-token");
		expect(mockGet.mock.calls[1][0]).toBe("/appointments/a-2/checkin-token");
	});

	// checkInByQr
	it("checkInByQr — chama POST /appointments/checkin com token como query param", async () => {
		const checkedIn = { ...appointment, status: "CHECKED_IN" as const };
		mockPost.mockResolvedValueOnce({ data: checkedIn });

		const result = await appointmentsApi.checkInByQr("TOKEN-XYZ-123");

		expect(mockPost).toHaveBeenCalledWith(
			"/appointments/checkin",
			null,
			expect.objectContaining({ params: { token: "TOKEN-XYZ-123" } }),
		);
		expect(result.status).toBe("CHECKED_IN");
	});

	// getQueue
	it("getQueue — chama GET /appointments/queue e retorna lista", async () => {
		const queue = [appointment, { ...appointment, id: "a-2" }];
		mockGet.mockResolvedValueOnce({ data: queue });

		const result = await appointmentsApi.getQueue();

		expect(mockGet).toHaveBeenCalledWith("/appointments/queue");
		expect(result).toHaveLength(2);
	});

	it("getQueue — fila vazia retorna array vazio", async () => {
		mockGet.mockResolvedValueOnce({ data: [] });

		const result = await appointmentsApi.getQueue();

		expect(result).toEqual([]);
	});

	// callPatient
	it("callPatient — chama PUT /appointments/:id/call e retorna IN_PROGRESS", async () => {
		const called = { ...appointment, status: "IN_PROGRESS" as const };
		mockPut.mockResolvedValueOnce({ data: called });

		const result = await appointmentsApi.callPatient("a-1");

		expect(mockPut).toHaveBeenCalledWith("/appointments/a-1/call");
		expect(result.status).toBe("IN_PROGRESS");
	});

	// setModality
	it("setModality — chama PUT /appointments/:id/modality com ONLINE", async () => {
		const online = {
			...appointment,
			modality: "ONLINE" as const,
			meetLink: "https://meet.google.com/abc",
		};
		mockPut.mockResolvedValueOnce({ data: online });

		const result = await appointmentsApi.setModality("a-1", {
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

		await appointmentsApi.setModality("a-1", { modality: "IN_PERSON" });

		expect(mockPut).toHaveBeenCalledWith("/appointments/a-1/modality", {
			modality: "IN_PERSON",
		});
	});

	// generateMeetLink
	it("generateMeetLink — chama POST /appointments/:id/meet-link e retorna meetLink", async () => {
		const withLink = {
			...appointment,
			meetLink: "https://meet.google.com/xyz-abc-def",
		};
		mockPost.mockResolvedValueOnce({ data: withLink });

		const result = await appointmentsApi.generateMeetLink("a-1");

		expect(mockPost).toHaveBeenCalledWith("/appointments/a-1/meet-link");
		expect(result.meetLink).toBe("https://meet.google.com/xyz-abc-def");
	});

	// createPayment
	it("createPayment — chama POST /appointments/:id/payment sem amount", async () => {
		const payment = {
			checkoutUrl: "https://mp.com/checkout",
			preferenceId: "pref-1",
			appointmentId: "a-1",
		};
		mockPost.mockResolvedValueOnce({ data: payment });

		const result = await appointmentsApi.createPayment("a-1");

		expect(mockPost).toHaveBeenCalledWith("/appointments/a-1/payment", null, {
			params: {},
		});
		expect(result.checkoutUrl).toContain("mp.com");
	});

	it("createPayment — envia amount quando definido", async () => {
		const payment = {
			checkoutUrl: "https://mp.com/checkout",
			preferenceId: "pref-2",
			appointmentId: "a-1",
		};
		mockPost.mockResolvedValueOnce({ data: payment });

		await appointmentsApi.createPayment("a-1", 350);

		expect(mockPost).toHaveBeenCalledWith(
			"/appointments/a-1/payment",
			null,
			expect.objectContaining({ params: { amount: 350 } }),
		);
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
