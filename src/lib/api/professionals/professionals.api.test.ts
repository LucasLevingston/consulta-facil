import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { professionalsListingApi } from "./professionals.api";

const mockGet = vi.mocked(api.get);

const professional = {
	id: "p-1",
	userId: "u-1",
	name: "Dra. Ana",
	specialty: "Dermatologia",
	licenseNumber: "CRM-99999",
};

function makePage(
	content: (typeof professional)[],
	totalElements: number,
	totalPages: number,
	pageNumber: number,
) {
	return { content, totalElements, totalPages, size: 12, number: pageNumber };
}

// ── getAll ────────────────────────────────────────────────────────────────────

describe("professionalsListingApi — getAll", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama GET /professionals com paginação padrão", async () => {
		const dr = {
			id: "d-1",
			name: "Dr. João",
			email: "joao@clinica.com",
			profession: "Médico",
			specialty: "Cardiologia",
			licenseNumber: "CRM-12345",
			phone: "11999990000",
		};
		mockGet.mockResolvedValueOnce({
			data: { content: [dr], totalElements: 1, totalPages: 1, number: 0 },
		});

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
		mockGet.mockResolvedValueOnce({
			data: { content: [], totalElements: 0, totalPages: 0, number: 2 },
		});

		await professionalsListingApi.getAll(2, 5);

		expect(mockGet).toHaveBeenCalledWith(
			"/professionals",
			expect.objectContaining({
				params: expect.objectContaining({ page: 2, size: 5 }),
			}),
		);
	});

	it("primeira página retorna content e metadados corretos", async () => {
		const page = makePage([professional], 1, 1, 0);
		mockGet.mockResolvedValueOnce({ data: page });

		const result = await professionalsListingApi.getAll(0, 12);

		expect(mockGet).toHaveBeenCalledWith(
			"/professionals",
			expect.objectContaining({
				params: expect.objectContaining({ page: 0, size: 12 }),
			}),
		);
		expect(result.number).toBe(0);
		expect(result.totalPages).toBe(1);
		expect(result.content).toHaveLength(1);
	});

	it("segunda página passa page=1 para a API", async () => {
		const page = makePage([professional], 25, 3, 1);
		mockGet.mockResolvedValueOnce({ data: page });

		const result = await professionalsListingApi.getAll(1, 12);

		expect(mockGet).toHaveBeenCalledWith(
			"/professionals",
			expect.objectContaining({ params: expect.objectContaining({ page: 1 }) }),
		);
		expect(result.number).toBe(1);
		expect(result.totalPages).toBe(3);
	});

	it("última página retorna last=true", async () => {
		const page = {
			...makePage([professional], 25, 3, 2),
			last: true,
			first: false,
		};
		mockGet.mockResolvedValueOnce({ data: page });

		const result = await professionalsListingApi.getAll(2, 12);

		expect(result.number).toBe(2);
		expect(result.last).toBe(true);
	});

	it("totalPages > 1 permite navegar entre páginas", async () => {
		const pageOne = makePage([professional], 30, 3, 0);
		const pageTwo = makePage([{ ...professional, id: "p-2" }], 30, 3, 1);

		mockGet
			.mockResolvedValueOnce({ data: pageOne })
			.mockResolvedValueOnce({ data: pageTwo });

		const r1 = await professionalsListingApi.getAll(0, 12);
		const r2 = await professionalsListingApi.getAll(1, 12);

		expect(r1.content[0].id).toBe("p-1");
		expect(r2.content[0].id).toBe("p-2");
		expect(r1.totalPages).toBe(r2.totalPages);
	});

	it("filtra por especialidade e passa para a API", async () => {
		mockGet.mockResolvedValueOnce({ data: makePage([], 0, 0, 0) });

		await professionalsListingApi.getAll(0, 12, undefined, "Cardiologia");

		expect(mockGet).toHaveBeenCalledWith(
			"/professionals",
			expect.objectContaining({
				params: expect.objectContaining({ specialty: "Cardiologia" }),
			}),
		);
	});

	it("filtra por nome", async () => {
		mockGet.mockResolvedValueOnce({ data: makePage([], 0, 0, 0) });

		await professionalsListingApi.getAll(0, 12, undefined, undefined, "Ana");

		expect(mockGet).toHaveBeenCalledWith(
			"/professionals",
			expect.objectContaining({
				params: expect.objectContaining({ name: "Ana" }),
			}),
		);
	});

	it("string vazia para filtros é enviada como undefined", async () => {
		mockGet.mockResolvedValueOnce({ data: makePage([], 0, 0, 0) });

		await professionalsListingApi.getAll(0, 12, "", "", "");

		const callParams = mockGet.mock.calls[0][1] as {
			params: Record<string, unknown>;
		};
		expect(callParams.params.profession).toBeUndefined();
		expect(callParams.params.specialty).toBeUndefined();
		expect(callParams.params.name).toBeUndefined();
	});

	it("retorna totalElements correto em resultado vazio", async () => {
		mockGet.mockResolvedValueOnce({ data: makePage([], 0, 0, 0) });

		const result = await professionalsListingApi.getAll(0, 12);

		expect(result.totalElements).toBe(0);
		expect(result.totalPages).toBe(0);
		expect(result.content).toHaveLength(0);
	});

	it("filtra por serviceTitle e passa para a API", async () => {
		mockGet.mockResolvedValueOnce({ data: makePage([], 0, 0, 0) });

		await professionalsListingApi.getAll(
			0,
			12,
			undefined,
			undefined,
			undefined,
			"Acupuntura",
		);

		expect(mockGet).toHaveBeenCalledWith(
			"/professionals",
			expect.objectContaining({
				params: expect.objectContaining({ serviceTitle: "Acupuntura" }),
			}),
		);
	});

	it("serviceTitle vazio é enviado como undefined", async () => {
		mockGet.mockResolvedValueOnce({ data: makePage([], 0, 0, 0) });

		await professionalsListingApi.getAll(0, 12, "", "", "", "");

		const callParams = mockGet.mock.calls[0][1] as {
			params: Record<string, unknown>;
		};
		expect(callParams.params.serviceTitle).toBeUndefined();
	});

	it("combinação de specialty + serviceTitle envia ambos os filtros", async () => {
		mockGet.mockResolvedValueOnce({ data: makePage([professional], 1, 1, 0) });

		await professionalsListingApi.getAll(
			0,
			12,
			undefined,
			"Dermatologia",
			undefined,
			"Peeling",
		);

		const callParams = mockGet.mock.calls[0][1] as {
			params: Record<string, unknown>;
		};
		expect(callParams.params.specialty).toBe("Dermatologia");
		expect(callParams.params.serviceTitle).toBe("Peeling");
	});

	it("paginação com serviceTitle mantém filtro em todas as páginas", async () => {
		mockGet
			.mockResolvedValueOnce({ data: makePage([professional], 25, 3, 0) })
			.mockResolvedValueOnce({
				data: makePage([{ ...professional, id: "p-2" }], 25, 3, 1),
			});

		await professionalsListingApi.getAll(
			0,
			12,
			undefined,
			undefined,
			undefined,
			"Botox",
		);
		await professionalsListingApi.getAll(
			1,
			12,
			undefined,
			undefined,
			undefined,
			"Botox",
		);

		for (const call of mockGet.mock.calls) {
			const params = (call[1] as { params: Record<string, unknown> }).params;
			expect(params.serviceTitle).toBe("Botox");
		}
	});
});

// ── getById ───────────────────────────────────────────────────────────────────

describe("professionalsListingApi — getById", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama GET /professionals/:id e retorna o profissional", async () => {
		const dr = {
			id: "d-1",
			name: "Dr. João",
			email: "joao@clinica.com",
			profession: "Médico",
			specialty: "Cardiologia",
			licenseNumber: "CRM-12345",
			phone: "11999990000",
		};
		mockGet.mockResolvedValueOnce({ data: dr });

		const result = await professionalsListingApi.getById("d-1");

		expect(mockGet).toHaveBeenCalledWith("/professionals/d-1");
		expect(result.id).toBe("d-1");
	});
});

// ── searchBySpecialty ────────────────────────────────────────────────────────

describe("professionalsListingApi — searchBySpecialty", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama GET /professionals/search com a especialidade", async () => {
		const page = {
			content: [{ ...professional, specialty: "Cardiologia" }],
			totalElements: 1,
			totalPages: 1,
			number: 0,
		};
		mockGet.mockResolvedValueOnce({ data: page });

		const result =
			await professionalsListingApi.searchBySpecialty("Cardiologia");

		expect(mockGet).toHaveBeenCalledWith("/professionals/search", {
			params: { specialty: "Cardiologia", page: 0, size: 20 },
		});
		expect(result.content[0].specialty).toBe("Cardiologia");
	});
});

// ── getNearby ─────────────────────────────────────────────────────────────────

describe("professionalsListingApi — getNearby filtros de localização", () => {
	beforeEach(() => vi.clearAllMocks());

	it("passa lat, lng e radiusKm para a API", async () => {
		mockGet.mockResolvedValueOnce({ data: [professional] });

		const result = await professionalsListingApi.getNearby(-23.5, -46.6, 30);

		expect(mockGet).toHaveBeenCalledWith(
			"/professionals/nearby",
			expect.objectContaining({
				params: expect.objectContaining({
					lat: -23.5,
					lng: -46.6,
					radiusKm: 30,
				}),
			}),
		);
		expect(result).toHaveLength(1);
	});

	it("filtra por specialty e passa corretamente", async () => {
		mockGet.mockResolvedValueOnce({ data: [professional] });

		await professionalsListingApi.getNearby(-23.5, -46.6, 50, "Cardiologia");

		const params = (
			mockGet.mock.calls[0][1] as { params: Record<string, unknown> }
		).params;
		expect(params.specialty).toBe("Cardiologia");
	});

	it("filtra por profession e passa corretamente", async () => {
		mockGet.mockResolvedValueOnce({ data: [] });

		await professionalsListingApi.getNearby(
			-23.5,
			-46.6,
			50,
			undefined,
			"Médico",
		);

		const params = (
			mockGet.mock.calls[0][1] as { params: Record<string, unknown> }
		).params;
		expect(params.profession).toBe("Médico");
	});

	it("combina specialty + profession em filtro simultâneo", async () => {
		mockGet.mockResolvedValueOnce({ data: [professional] });

		await professionalsListingApi.getNearby(
			-7.1,
			-34.8,
			20,
			"Pediatria",
			"Médico",
		);

		const params = (
			mockGet.mock.calls[0][1] as { params: Record<string, unknown> }
		).params;
		expect(params.specialty).toBe("Pediatria");
		expect(params.profession).toBe("Médico");
		expect(params.lat).toBe(-7.1);
		expect(params.lng).toBe(-34.8);
		expect(params.radiusKm).toBe(20);
	});

	it("specialty undefined não envia parâmetro", async () => {
		mockGet.mockResolvedValueOnce({ data: [] });

		await professionalsListingApi.getNearby(-23.5, -46.6, 50, undefined);

		const params = (
			mockGet.mock.calls[0][1] as { params: Record<string, unknown> }
		).params;
		expect(params.specialty).toBeUndefined();
	});

	it("retorna array vazio quando nenhum profissional encontrado", async () => {
		mockGet.mockResolvedValueOnce({ data: [] });

		const result = await professionalsListingApi.getNearby(-23.5, -46.6, 5);

		expect(result).toEqual([]);
	});

	it("retorna múltiplos profissionais dentro do raio", async () => {
		const profs = [professional, { ...professional, id: "prof-2" }];
		mockGet.mockResolvedValueOnce({ data: profs });

		const result = await professionalsListingApi.getNearby(-23.5, -46.6, 50);

		expect(result).toHaveLength(2);
	});
});
