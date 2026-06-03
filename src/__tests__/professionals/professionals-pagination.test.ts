import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { professionalsApi } from "@/lib/api/doctors.api";

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

describe("professionalsApi — getAll pagination", () => {
	beforeEach(() => vi.clearAllMocks());

	it("primeira página retorna content e metadados corretos", async () => {
		const page = makePage([professional], 1, 1, 0);
		mockGet.mockResolvedValueOnce({ data: page });

		const result = await professionalsApi.getAll(0, 12);

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

		const result = await professionalsApi.getAll(1, 12);

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

		const result = await professionalsApi.getAll(2, 12);

		expect(result.number).toBe(2);
		expect(result.last).toBe(true);
	});

	it("totalPages > 1 permite navegar entre páginas", async () => {
		const pageOne = makePage([professional], 30, 3, 0);
		const pageTwo = makePage([{ ...professional, id: "p-2" }], 30, 3, 1);

		mockGet
			.mockResolvedValueOnce({ data: pageOne })
			.mockResolvedValueOnce({ data: pageTwo });

		const r1 = await professionalsApi.getAll(0, 12);
		const r2 = await professionalsApi.getAll(1, 12);

		expect(r1.content[0].id).toBe("p-1");
		expect(r2.content[0].id).toBe("p-2");
		expect(r1.totalPages).toBe(r2.totalPages);
	});

	it("filtra por especialidade e passa para a API", async () => {
		mockGet.mockResolvedValueOnce({ data: makePage([], 0, 0, 0) });

		await professionalsApi.getAll(0, 12, undefined, "Cardiologia");

		expect(mockGet).toHaveBeenCalledWith(
			"/professionals",
			expect.objectContaining({
				params: expect.objectContaining({ specialty: "Cardiologia" }),
			}),
		);
	});

	it("filtra por nome", async () => {
		mockGet.mockResolvedValueOnce({ data: makePage([], 0, 0, 0) });

		await professionalsApi.getAll(0, 12, undefined, undefined, "Ana");

		expect(mockGet).toHaveBeenCalledWith(
			"/professionals",
			expect.objectContaining({
				params: expect.objectContaining({ name: "Ana" }),
			}),
		);
	});

	it("string vazia para filtros é enviada como undefined", async () => {
		mockGet.mockResolvedValueOnce({ data: makePage([], 0, 0, 0) });

		await professionalsApi.getAll(0, 12, "", "", "");

		const callParams = mockGet.mock.calls[0][1] as {
			params: Record<string, unknown>;
		};
		expect(callParams.params.profession).toBeUndefined();
		expect(callParams.params.specialty).toBeUndefined();
		expect(callParams.params.name).toBeUndefined();
	});

	it("retorna totalElements correto em resultado vazio", async () => {
		mockGet.mockResolvedValueOnce({ data: makePage([], 0, 0, 0) });

		const result = await propessionalPage0();

		expect(result.totalElements).toBe(0);
		expect(result.totalPages).toBe(0);
		expect(result.content).toHaveLength(0);
	});

	it("filtra por serviceTitle e passa para a API", async () => {
		mockGet.mockResolvedValueOnce({ data: makePage([], 0, 0, 0) });

		await professionalsApi.getAll(
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

		await professionalsApi.getAll(0, 12, "", "", "", "");

		const callParams = mockGet.mock.calls[0][1] as {
			params: Record<string, unknown>;
		};
		expect(callParams.params.serviceTitle).toBeUndefined();
	});

	it("combinação de specialty + serviceTitle envia ambos os filtros", async () => {
		mockGet.mockResolvedValueOnce({ data: makePage([professional], 1, 1, 0) });

		await professionalsApi.getAll(
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

		await professionalsApi.getAll(
			0,
			12,
			undefined,
			undefined,
			undefined,
			"Botox",
		);
		await professionalsApi.getAll(
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

async function propessionalPage0() {
	return professionalsApi.getAll(0, 12);
}
