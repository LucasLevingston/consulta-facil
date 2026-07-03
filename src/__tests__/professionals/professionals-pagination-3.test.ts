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
});
