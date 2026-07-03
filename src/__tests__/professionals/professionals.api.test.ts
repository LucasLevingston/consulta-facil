import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { professionalsListingApi } from "@/lib/api/professionals/professionals.api";

const mockGet = vi.mocked(api.get);

const professional = {
	id: "d-1",
	name: "Dr. João",
	email: "joao@clinica.com",
	profession: "Médico",
	specialty: "Cardiologia",
	licenseNumber: "CRM-12345",
	phone: "11999990000",
};

const page = {
	content: [professional],
	totalElements: 1,
	totalPages: 1,
	number: 0,
};

describe("professionalsApi", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("getAll", () => {
		it("chama GET /professionals com paginação padrão", async () => {
			mockGet.mockResolvedValueOnce({ data: page });

			const result = await professionalsListingApi.getAll();

			expect(mockGet).toHaveBeenCalledWith(
				"/professionals",
				expect.objectContaining({
					params: expect.objectContaining({ page: 0, size: 12 }),
				}),
			);
			expect(result.content).toHaveLength(1);
		});

		it("chama GET /professionals com paginação customizada", async () => {
			mockGet.mockResolvedValueOnce({ data: page });

			await professionalsListingApi.getAll(2, 5);

			expect(mockGet).toHaveBeenCalledWith(
				"/professionals",
				expect.objectContaining({
					params: expect.objectContaining({ page: 2, size: 5 }),
				}),
			);
		});
	});

	describe("getById", () => {
		it("chama GET /professionals/:id e retorna o profissional", async () => {
			mockGet.mockResolvedValueOnce({ data: professional });

			const result = await professionalsListingApi.getById("d-1");

			expect(mockGet).toHaveBeenCalledWith("/professionals/d-1");
			expect(result.id).toBe("d-1");
		});
	});

	describe("searchBySpecialty", () => {
		it("chama GET /professionals/search com a especialidade", async () => {
			mockGet.mockResolvedValueOnce({ data: page });

			const result =
				await professionalsListingApi.searchBySpecialty("Cardiologia");

			expect(mockGet).toHaveBeenCalledWith("/professionals/search", {
				params: { specialty: "Cardiologia", page: 0, size: 20 },
			});
			expect(result.content[0].specialty).toBe("Cardiologia");
		});
	});
});
