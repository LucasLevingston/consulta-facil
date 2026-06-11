import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { appointmentsApi } from "@/lib/api/appointments.api";

const mockGet = vi.mocked(api.get);

const appt = {
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

const page = { content: [appt], totalElements: 1, totalPages: 1, number: 0 };

describe("appointmentsApi.getAll — admin endpoint", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama GET /appointments com page e size padrão", async () => {
		mockGet.mockResolvedValueOnce({ data: page });

		const result = await appointmentsApi.getAll();

		expect(mockGet).toHaveBeenCalledWith("/appointments", {
			params: { page: 0, size: 100 },
		});
		expect(result.content).toHaveLength(1);
	});

	it("chama GET /appointments com page e size customizados", async () => {
		mockGet.mockResolvedValueOnce({ data: page });

		await appointmentsApi.getAll(2, 50);

		expect(mockGet).toHaveBeenCalledWith("/appointments", {
			params: { page: 2, size: 50 },
		});
	});

	it("retorna totalElements e totalPages", async () => {
		const bigPage = { ...page, totalElements: 99, totalPages: 2 };
		mockGet.mockResolvedValueOnce({ data: bigPage });

		const result = await appointmentsApi.getAll(0, 50);

		expect(result.totalElements).toBe(99);
		expect(result.totalPages).toBe(2);
	});

	it("retorna appointments com paymentStatus e paymentAmount", async () => {
		mockGet.mockResolvedValueOnce({ data: page });

		const result = await appointmentsApi.getAll();

		expect(result.content[0].paymentStatus).toBe("PAID");
		expect(result.content[0].paymentAmount).toBe(200);
	});

	it("retorna appointments com patientName e professionalName", async () => {
		mockGet.mockResolvedValueOnce({ data: page });

		const result = await appointmentsApi.getAll();

		expect(result.content[0].patientName).toBe("João Silva");
		expect(result.content[0].professionalName).toBe("Dra. Ana");
	});

	it("retorna página vazia sem erros", async () => {
		const empty = { content: [], totalElements: 0, totalPages: 0, number: 0 };
		mockGet.mockResolvedValueOnce({ data: empty });

		const result = await appointmentsApi.getAll();

		expect(result.content).toHaveLength(0);
		expect(result.totalElements).toBe(0);
	});

	it("retorna múltiplas consultas de profissionais diferentes", async () => {
		const appt2 = {
			...appt,
			id: "a-2",
			professionalName: "Dr. Carlos",
			paymentAmount: 350,
		};
		const multiPage = { ...page, content: [appt, appt2], totalElements: 2 };
		mockGet.mockResolvedValueOnce({ data: multiPage });

		const result = await appointmentsApi.getAll();

		expect(result.content).toHaveLength(2);
		const names = result.content.map((a) => a.professionalName);
		expect(names).toContain("Dra. Ana");
		expect(names).toContain("Dr. Carlos");
	});
});
