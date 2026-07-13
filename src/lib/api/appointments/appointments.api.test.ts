import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { appointmentsCrudApi } from "./appointments.api";

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

const adminAppt = {
	id: "a-1",
	patientId: "p-1",
	professionalId: "d-1",
	patientName: "João Silva",
	professionalName: "Dra. Ana",
	status: "COMPLETED" as const,
	paymentStatus: "PAID" as const,
	paymentAmount: 200,
	scheduledAt: "2026-06-01T10:00:00Z",
	serviceName: "Consulta",
};

const page = {
	content: [appointment],
	totalElements: 1,
	totalPages: 1,
	number: 0,
};

const adminPage = {
	content: [adminAppt],
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

describe("appointmentsCrudApi.getAll — admin endpoint", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama GET /appointments com page e size padrão", async () => {
		mockGet.mockResolvedValueOnce({ data: adminPage });

		const result = await appointmentsCrudApi.getAll();

		expect(mockGet).toHaveBeenCalledWith("/appointments", {
			params: { page: 0, size: 100 },
		});
		expect(result.content).toHaveLength(1);
	});

	it("chama GET /appointments com page e size customizados", async () => {
		mockGet.mockResolvedValueOnce({ data: adminPage });

		await appointmentsCrudApi.getAll(2, 50);

		expect(mockGet).toHaveBeenCalledWith("/appointments", {
			params: { page: 2, size: 50 },
		});
	});

	it("retorna totalElements e totalPages", async () => {
		const bigPage = { ...adminPage, totalElements: 99, totalPages: 2 };
		mockGet.mockResolvedValueOnce({ data: bigPage });

		const result = await appointmentsCrudApi.getAll(0, 50);

		expect(result.totalElements).toBe(99);
		expect(result.totalPages).toBe(2);
	});

	it("retorna appointments com paymentStatus e paymentAmount", async () => {
		mockGet.mockResolvedValueOnce({ data: adminPage });

		const result = await appointmentsCrudApi.getAll();

		expect(result.content[0].paymentStatus).toBe("PAID");
		expect(result.content[0].paymentAmount).toBe(200);
	});

	it("retorna appointments com patientName e professionalName", async () => {
		mockGet.mockResolvedValueOnce({ data: adminPage });

		const result = await appointmentsCrudApi.getAll();

		expect(result.content[0].patientName).toBe("João Silva");
		expect(result.content[0].professionalName).toBe("Dra. Ana");
	});

	it("retorna página vazia sem erros", async () => {
		const empty = { content: [], totalElements: 0, totalPages: 0, number: 0 };
		mockGet.mockResolvedValueOnce({ data: empty });

		const result = await appointmentsCrudApi.getAll();

		expect(result.content).toHaveLength(0);
		expect(result.totalElements).toBe(0);
	});

	it("retorna múltiplas consultas de profissionais diferentes", async () => {
		const appt2 = {
			...adminAppt,
			id: "a-2",
			professionalName: "Dr. Carlos",
			paymentAmount: 350,
		};
		const multiPage = {
			...adminPage,
			content: [adminAppt, appt2],
			totalElements: 2,
		};
		mockGet.mockResolvedValueOnce({ data: multiPage });

		const result = await appointmentsCrudApi.getAll();

		expect(result.content).toHaveLength(2);
		const names = result.content.map((a) => a.professionalName);
		expect(names).toContain("Dra. Ana");
		expect(names).toContain("Dr. Carlos");
	});
});
