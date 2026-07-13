import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		delete: vi.fn(),
		patch: vi.fn(),
	},
}));

import { api } from "@/config/api";
import { professionalProfileApi } from "./professional-profile.api";

const mockPut = vi.mocked(api.put);
const mockDelete = vi.mocked(api.delete);
const mockPatch = vi.mocked(api.patch);

const professional = {
	id: "d-1",
	name: "Dr. João",
	email: "joao@clinica.com",
	profession: "Médico",
	specialty: "Cardiologia",
	licenseNumber: "CRM-12345",
	phone: "11999990000",
};

describe("professionalProfileApi — update", () => {
	beforeEach(() => vi.clearAllMocks());

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

	it("chama PUT /professionals/:id com os dados e retorna o profissional atualizado", async () => {
		mockPut.mockResolvedValueOnce({ data: professional });

		const result = await professionalProfileApi.update("d-1", {
			profession: "MEDICO",
			specialty: "CARDIOLOGIA",
			licenseNumber: "12345",
		});

		expect(mockPut).toHaveBeenCalledWith("/professionals/d-1", {
			profession: "MEDICO",
			specialty: "CARDIOLOGIA",
			licenseNumber: "12345",
		});
		expect(result).toEqual(professional);
	});

	it("propaga erro 403 quando o usuário não tem permissão", async () => {
		const error = Object.assign(new Error("Forbidden"), {
			response: { status: 403 },
		});
		mockPut.mockRejectedValueOnce(error);

		await expect(
			professionalProfileApi.update("d-1", {
				profession: "MEDICO",
				specialty: "CARDIOLOGIA",
				licenseNumber: "12345",
			}),
		).rejects.toThrow("Forbidden");
	});
});

describe("professionalProfileApi — delete", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama DELETE /professionals/:id", async () => {
		mockDelete.mockResolvedValueOnce({ data: undefined });

		await professionalProfileApi.delete("d-1");

		expect(mockDelete).toHaveBeenCalledWith("/professionals/d-1");
	});
});

describe("professionalProfileApi — updateBio", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama PATCH /professionals/me/bio com os dados", async () => {
		mockPatch.mockResolvedValueOnce({ data: professional });

		await professionalProfileApi.updateBio({ bio: "Nova bio" });

		expect(mockPatch).toHaveBeenCalledWith("/professionals/me/bio", {
			bio: "Nova bio",
		});
	});
});

describe("professionalProfileApi — updateSocialLinks", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama PATCH /professionals/me/social-links com os dados", async () => {
		mockPatch.mockResolvedValueOnce({ data: professional });

		await professionalProfileApi.updateSocialLinks({
			instagramUrl: "https://instagram.com/dr.joao",
		});

		expect(mockPatch).toHaveBeenCalledWith("/professionals/me/social-links", {
			instagramUrl: "https://instagram.com/dr.joao",
		});
	});
});

describe("professionalProfileApi — updateCouncil", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama PATCH /professionals/me/council com os dados", async () => {
		mockPatch.mockResolvedValueOnce({ data: professional });

		await professionalProfileApi.updateCouncil({
			councilType: "CRM",
			councilState: "SP",
		});

		expect(mockPatch).toHaveBeenCalledWith("/professionals/me/council", {
			councilType: "CRM",
			councilState: "SP",
		});
	});
});

describe("professionalProfileApi — updateAddress", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama PATCH /professionals/me/address com os dados", async () => {
		mockPatch.mockResolvedValueOnce({ data: professional });

		await professionalProfileApi.updateAddress({
			city: "São Paulo",
			state: "SP",
		});

		expect(mockPatch).toHaveBeenCalledWith("/professionals/me/address", {
			city: "São Paulo",
			state: "SP",
		});
	});
});
