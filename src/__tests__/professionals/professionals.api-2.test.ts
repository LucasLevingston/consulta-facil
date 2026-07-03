import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { professionalApplicationsApi } from "@/lib/api/professionals/professional-applications.api";
import { professionalProfileApi } from "@/lib/api/professionals/professional-profile.api";

const _mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);
const mockPut = vi.mocked(api.put);
const mockDelete = vi.mocked(api.delete);

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

describe("professionalsApi", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("create", () => {
		it("chama POST /professionals e retorna o profissional criado", async () => {
			mockPost.mockResolvedValueOnce({ data: professional });

			const result = await professionalApplicationsApi.create({
				name: professional.name,
				email: professional.email,
				profession: professional.profession,
				specialty: professional.specialty,
				licenseNumber: professional.licenseNumber,
				phone: professional.phone,
			});

			expect(mockPost).toHaveBeenCalledWith(
				"/professionals",
				expect.objectContaining({ name: professional.name }),
			);
			expect(result.id).toBe("d-1");
		});
	});

	describe("update", () => {
		it("chama PUT /professionals/:id e retorna o profissional atualizado", async () => {
			const updated = { ...professional, name: "Dr. João Atualizado" };
			mockPut.mockResolvedValueOnce({ data: updated });

			const result = await professionalProfileApi.update("d-1", {
				...professional,
				name: "Dr. João Atualizado",
			});

			expect(mockPut).toHaveBeenCalledWith(
				"/professionals/d-1",
				expect.objectContaining({ name: "Dr. João Atualizado" }),
			);
			expect(result.name).toBe("Dr. João Atualizado");
		});
	});

	describe("delete", () => {
		it("chama DELETE /professionals/:id", async () => {
			mockDelete.mockResolvedValueOnce({ data: undefined });

			await professionalProfileApi.delete("d-1");

			expect(mockDelete).toHaveBeenCalledWith("/professionals/d-1");
		});
	});
});
