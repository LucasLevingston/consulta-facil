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

		const result = await propessionalPage0();

		expect(result.totalElements).toBe(0);
		expect(result.totalPages).toBe(0);
		expect(result.content).toHaveLength(0);
	});
});

async function propessionalPage0() {
	return professionalsListingApi.getAll(0, 12);
}
