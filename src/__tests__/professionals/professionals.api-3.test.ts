import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { professionalKeys } from "@/hooks/api/professionals/professional-keys";
import { professionalApplicationsApi } from "@/lib/api/professionals/professional-applications.api";

const mockGet = vi.mocked(api.get);
const _mockPost = vi.mocked(api.post);
const _mockPut = vi.mocked(api.put);
const _mockDelete = vi.mocked(api.delete);

const professional = {
	id: "d-1",
	name: "Dr. João",
	email: "joao@clinica.com",
	profession: "Médico",
	specialty: "Cardiologia",
	licenseNumber: "CRM-12345",
	phone: "11999990000",
};

const _page = {
	content: [professional],
	totalElements: 1,
	totalPages: 1,
	number: 0,
};

describe("professionalsApi — getApplicationStatus", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama GET /professionals/application-status e retorna perfil", async () => {
		mockGet.mockResolvedValueOnce({ data: professional });

		const result = await professionalApplicationsApi.getApplicationStatus();

		expect(mockGet).toHaveBeenCalledWith("/professionals/application-status");
		expect(result.id).toBe("d-1");
	});

	it("retorna status da candidatura do profissional autenticado", async () => {
		const pending = { ...professional, status: "PENDING_REVIEW" };
		mockGet.mockResolvedValueOnce({ data: pending });

		const result = await professionalApplicationsApi.getApplicationStatus();

		expect(result.status).toBe("PENDING_REVIEW");
	});

	it("não requer parâmetros na chamada", async () => {
		mockGet.mockResolvedValueOnce({ data: professional });

		await professionalApplicationsApi.getApplicationStatus();

		expect(mockGet).toHaveBeenCalledWith("/professionals/application-status");
		expect(mockGet).toHaveBeenCalledTimes(1);
	});
});

describe("professionalKeys", () => {
	it("all retorna a chave raiz", () => {
		expect(professionalKeys.all).toEqual(["professionals"]);
	});

	it("list inclui page e size na chave", () => {
		expect(professionalKeys.list(0, 20)).toEqual([
			"professionals",
			"list",
			{ page: 0, size: 20 },
		]);
	});

	it("list sem argumentos inclui undefined", () => {
		expect(professionalKeys.list()).toEqual([
			"professionals",
			"list",
			{ page: undefined, size: undefined },
		]);
	});

	it("search inclui a especialidade na chave", () => {
		expect(professionalKeys.search("Cardiologia")).toEqual([
			"professionals",
			"search",
			"Cardiologia",
		]);
	});

	it("detail inclui o id na chave", () => {
		expect(professionalKeys.detail("d-42")).toEqual(["professionals", "d-42"]);
	});
});
