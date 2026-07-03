import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { professionalApplicationsApi } from "@/lib/api/professionals/professional-applications.api";

const mockGet = vi.mocked(api.get);
const _mockPut = vi.mocked(api.put);

const professional = {
	id: "prof-1",
	userId: "u-1",
	name: "Dr. Carlos",
	specialty: "Cardiologia",
	licenseNumber: "CRM/SP 100001",
	status: "PENDING_REVIEW",
};

function makePage(
	content: (typeof professional)[],
	totalElements: number,
	totalPages: number,
	pageNumber: number,
	size = 20,
) {
	return {
		content,
		totalElements,
		totalPages,
		size,
		number: pageNumber,
		first: pageNumber === 0,
		last: pageNumber === totalPages - 1,
	};
}

describe("professionalsApi — getPendingApplications pagination", () => {
	beforeEach(() => vi.clearAllMocks());

	it("tamanho de página personalizado passa size correto", async () => {
		mockGet.mockResolvedValueOnce({ data: makePage([], 0, 0, 0, 5) });

		await professionalApplicationsApi.getPendingApplications(0, 5);

		expect(mockGet).toHaveBeenCalledWith(
			"/professionals/applications",
			expect.objectContaining({ params: expect.objectContaining({ size: 5 }) }),
		);
	});

	it("fila vazia retorna totalElements=0 e content vazio", async () => {
		mockGet.mockResolvedValueOnce({ data: makePage([], 0, 0, 0) });

		const result = await professionalApplicationsApi.getPendingApplications(
			0,
			20,
		);

		expect(result.totalElements).toBe(0);
		expect(result.totalPages).toBe(0);
		expect(result.content).toHaveLength(0);
	});

	it("navegação entre páginas mantém totalElements consistente", async () => {
		const totalElements = 60;
		mockGet
			.mockResolvedValueOnce({
				data: makePage([professional], totalElements, 3, 0),
			})
			.mockResolvedValueOnce({
				data: makePage([professional], totalElements, 3, 1),
			})
			.mockResolvedValueOnce({
				data: makePage([professional], totalElements, 3, 2),
			});

		const p0 = await professionalApplicationsApi.getPendingApplications(0, 20);
		const p1 = await professionalApplicationsApi.getPendingApplications(1, 20);
		const p2 = await professionalApplicationsApi.getPendingApplications(2, 20);

		expect(p0.totalElements).toBe(totalElements);
		expect(p1.totalElements).toBe(totalElements);
		expect(p2.totalElements).toBe(totalElements);
		expect(p0.first).toBe(true);
		expect(p2.last).toBe(true);
	});
});
