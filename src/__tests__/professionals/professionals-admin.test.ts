import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { professionalApplicationsApi } from "@/lib/api/professionals/professional-applications.api";

const mockGet = vi.mocked(api.get);

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

// ── getPendingApplications ────────────────────────────────────────────────────

describe("professionalsApi — getPendingApplications pagination", () => {
	beforeEach(() => vi.clearAllMocks());

	it("primeira página retorna metadados corretos", async () => {
		const page = makePage([professional], 3, 1, 0);
		mockGet.mockResolvedValueOnce({ data: page });

		const result = await professionalApplicationsApi.getPendingApplications(
			0,
			20,
		);

		expect(mockGet).toHaveBeenCalledWith(
			"/professionals/applications",
			expect.objectContaining({
				params: expect.objectContaining({ page: 0, size: 20 }),
			}),
		);
		expect(result.totalElements).toBe(3);
		expect(result.totalPages).toBe(1);
		expect(result.number).toBe(0);
		expect(result.content).toHaveLength(1);
	});

	it("segunda página passa page=1 corretamente", async () => {
		const page = makePage([professional], 45, 3, 1);
		mockGet.mockResolvedValueOnce({ data: page });

		const result = await professionalApplicationsApi.getPendingApplications(
			1,
			20,
		);

		expect(mockGet).toHaveBeenCalledWith(
			"/professionals/applications",
			expect.objectContaining({ params: expect.objectContaining({ page: 1 }) }),
		);
		expect(result.number).toBe(1);
		expect(result.totalPages).toBe(3);
	});

	it("última página retorna last=true", async () => {
		const page = makePage([professional], 45, 3, 2);
		mockGet.mockResolvedValueOnce({ data: page });

		const result = await professionalApplicationsApi.getPendingApplications(
			2,
			20,
		);

		expect(result.last).toBe(true);
		expect(result.number).toBe(2);
	});
});
