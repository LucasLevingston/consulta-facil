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
