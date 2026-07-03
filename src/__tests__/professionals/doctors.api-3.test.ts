import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { professionalKeys as doctorKeys } from "@/hooks/api/professionals/professional-keys";
import { professionalApplicationsApi } from "@/lib/api/professionals/professional-applications.api";

const mockGet = vi.mocked(api.get);
const _mockPost = vi.mocked(api.post);
const _mockPut = vi.mocked(api.put);
const _mockDelete = vi.mocked(api.delete);

const doctor = {
	id: "d-1",
	name: "Dr. João",
	email: "joao@clinica.com",
	profession: "Médico",
	specialty: "Cardiologia",
	licenseNumber: "CRM-12345",
	phone: "11999990000",
};

const _page = { content: [doctor], totalElements: 1, totalPages: 1, number: 0 };

describe("doctorsApi — getApplicationStatus", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama GET /professionals/application-status e retorna perfil", async () => {
		mockGet.mockResolvedValueOnce({ data: doctor });

		const result = await professionalApplicationsApi.getApplicationStatus();

		expect(mockGet).toHaveBeenCalledWith("/professionals/application-status");
		expect(result.id).toBe("d-1");
	});

	it("retorna status da candidatura do profissional autenticado", async () => {
		const pending = { ...doctor, status: "PENDING_REVIEW" };
		mockGet.mockResolvedValueOnce({ data: pending });

		const result = await professionalApplicationsApi.getApplicationStatus();

		expect(result.status).toBe("PENDING_REVIEW");
	});

	it("não requer parâmetros na chamada", async () => {
		mockGet.mockResolvedValueOnce({ data: doctor });

		await professionalApplicationsApi.getApplicationStatus();

		expect(mockGet).toHaveBeenCalledWith("/professionals/application-status");
		expect(mockGet).toHaveBeenCalledTimes(1);
	});
});

describe("doctorKeys", () => {
	it("all retorna a chave raiz", () => {
		expect(doctorKeys.all).toEqual(["professionals"]);
	});

	it("list inclui page e size na chave", () => {
		expect(doctorKeys.list(0, 20)).toEqual([
			"professionals",
			"list",
			{ page: 0, size: 20 },
		]);
	});

	it("list sem argumentos inclui undefined", () => {
		expect(doctorKeys.list()).toEqual([
			"professionals",
			"list",
			{ page: undefined, size: undefined },
		]);
	});

	it("search inclui a especialidade na chave", () => {
		expect(doctorKeys.search("Cardiologia")).toEqual([
			"professionals",
			"search",
			"Cardiologia",
		]);
	});

	it("detail inclui o id na chave", () => {
		expect(doctorKeys.detail("d-42")).toEqual(["professionals", "d-42"]);
	});
});
