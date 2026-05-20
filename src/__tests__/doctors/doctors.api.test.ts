import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { doctorKeys } from "@/hooks/api/use-doctors";
import { doctorsApi } from "@/lib/api/doctors.api";

const mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);
const mockPut = vi.mocked(api.put);
const mockDelete = vi.mocked(api.delete);

const doctor = {
	id: "d-1",
	name: "Dr. João",
	email: "joao@clinica.com",
	specialty: "Cardiologia",
	licenseNumber: "CRM-12345",
	phone: "11999990000",
};

const page = { content: [doctor], totalElements: 1, totalPages: 1, number: 0 };

describe("doctorsApi", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("getAll", () => {
		it("chama GET /professionals com paginação padrão", async () => {
			mockGet.mockResolvedValueOnce({ data: page });

			const result = await doctorsApi.getAll();

			expect(mockGet).toHaveBeenCalledWith("/professionals", {
				params: { page: 0, size: 20 },
			});
			expect(result.content).toHaveLength(1);
		});

		it("chama GET /professionals com paginação customizada", async () => {
			mockGet.mockResolvedValueOnce({ data: page });

			await doctorsApi.getAll(2, 5);

			expect(mockGet).toHaveBeenCalledWith("/professionals", {
				params: { page: 2, size: 5 },
			});
		});
	});

	describe("getById", () => {
		it("chama GET /professionals/:id e retorna o profissional", async () => {
			mockGet.mockResolvedValueOnce({ data: doctor });

			const result = await doctorsApi.getById("d-1");

			expect(mockGet).toHaveBeenCalledWith("/professionals/d-1");
			expect(result.id).toBe("d-1");
		});
	});

	describe("searchBySpecialty", () => {
		it("chama GET /professionals/search com a especialidade", async () => {
			mockGet.mockResolvedValueOnce({ data: page });

			const result = await doctorsApi.searchBySpecialty("Cardiologia");

			expect(mockGet).toHaveBeenCalledWith("/professionals/search", {
				params: { specialty: "Cardiologia", page: 0, size: 20 },
			});
			expect(result.content[0].specialty).toBe("Cardiologia");
		});
	});

	describe("create", () => {
		it("chama POST /professionals e retorna o profissional criado", async () => {
			mockPost.mockResolvedValueOnce({ data: doctor });

			const result = await doctorsApi.create({
				name: doctor.name,
				email: doctor.email,
				specialty: doctor.specialty,
				licenseNumber: doctor.licenseNumber,
				phone: doctor.phone,
			});

			expect(mockPost).toHaveBeenCalledWith(
				"/professionals",
				expect.objectContaining({ name: doctor.name }),
			);
			expect(result.id).toBe("d-1");
		});
	});

	describe("update", () => {
		it("chama PUT /professionals/:id e retorna o profissional atualizado", async () => {
			const updated = { ...doctor, name: "Dr. João Atualizado" };
			mockPut.mockResolvedValueOnce({ data: updated });

			const result = await doctorsApi.update("d-1", {
				...doctor,
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

			await doctorsApi.delete("d-1");

			expect(mockDelete).toHaveBeenCalledWith("/professionals/d-1");
		});
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
