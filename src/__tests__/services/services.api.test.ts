import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { professionalServicesApi } from "@/lib/api/services/professional-services.api";

const mockGet = vi.mocked(api.get);

const service = {
	id: "svc-1",
	name: "Consulta de Cardiologia",
	description: "Consulta clínica",
	price: 250,
	durationMinutes: 30,
	requiresConsultation: false,
	active: true,
};

// ── getByProfessional ─────────────────────────────────────────────────────────

describe("servicesApi — getByProfessional filtro por profissional", () => {
	beforeEach(() => vi.clearAllMocks());

	it("passa professionalId correto na URL", async () => {
		mockGet.mockResolvedValueOnce({ data: [service] });

		await professionalServicesApi.getByProfessional("prof-1");

		expect(mockGet).toHaveBeenCalledWith("/professional-services/prof-1");
	});

	it("IDs diferentes produzem URLs diferentes", async () => {
		mockGet
			.mockResolvedValueOnce({ data: [service] })
			.mockResolvedValueOnce({ data: [] });

		await professionalServicesApi.getByProfessional("prof-1");
		await professionalServicesApi.getByProfessional("prof-2");

		expect(mockGet.mock.calls[0][0]).toBe("/professional-services/prof-1");
		expect(mockGet.mock.calls[1][0]).toBe("/professional-services/prof-2");
	});

	it("retorna lista completa de serviços do profissional", async () => {
		const services = [
			service,
			{ ...service, id: "svc-2", name: "ECG" },
			{ ...service, id: "svc-3", name: "Holter" },
		];
		mockGet.mockResolvedValueOnce({ data: services });

		const result = await professionalServicesApi.getByProfessional("prof-1");

		expect(result).toHaveLength(3);
		expect(result.map((s) => s.name)).toEqual([
			"Consulta de Cardiologia",
			"ECG",
			"Holter",
		]);
	});

	it("profissional sem serviços retorna array vazio", async () => {
		mockGet.mockResolvedValueOnce({ data: [] });

		const result = await professionalServicesApi.getByProfessional("prof-new");

		expect(result).toEqual([]);
	});

	it("cada serviço contém price e durationMinutes", async () => {
		mockGet.mockResolvedValueOnce({ data: [service] });

		const result = await professionalServicesApi.getByProfessional("prof-1");

		expect(result[0].price).toBe(250);
		expect(result[0].durationMinutes).toBe(30);
	});

	it("filtra corretamente serviços que requerem consulta", async () => {
		const withConsultation = {
			...service,
			id: "svc-2",
			requiresConsultation: true,
		};
		mockGet.mockResolvedValueOnce({ data: [service, withConsultation] });

		const result = await professionalServicesApi.getByProfessional("prof-1");

		const requiresConsulta = result.filter((s) => s.requiresConsultation);
		expect(requiresConsulta).toHaveLength(1);
		expect(requiresConsulta[0].id).toBe("svc-2");
	});
});
