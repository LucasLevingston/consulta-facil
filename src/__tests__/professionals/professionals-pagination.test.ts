import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { professionalsListingApi } from "@/lib/api/professionals/professionals.api";

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
});
