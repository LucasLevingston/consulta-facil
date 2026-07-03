import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { professionalApplicationsApi } from "@/lib/api/professionals/professional-applications.api";
import { professionalsListingApi } from "@/lib/api/professionals/professionals.api";

const mockGet = vi.mocked(api.get);
const mockPut = vi.mocked(api.put);

const professional = {
	id: "prof-1",
	userId: "u-1",
	name: "Dr. Carlos",
	specialty: "Cardiologia",
	licenseNumber: "CRM/SP 100001",
	status: "PENDING_REVIEW",
};

describe("professionalsApi — getNearby filtros de localização", () => {
	beforeEach(() => vi.clearAllMocks());

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

// ── approve / reject ──────────────────────────────────────────────────────────

describe("professionalsApi — approve e reject", () => {
	beforeEach(() => vi.clearAllMocks());

	it("approve chama PUT na URL correta", async () => {
		const approved = { ...professional, status: "ACTIVE" };
		mockPut.mockResolvedValueOnce({ data: approved });

		const result = await professionalApplicationsApi.approve("prof-1");

		expect(mockPut).toHaveBeenCalledWith("/professionals/prof-1/approve");
		expect(result.status).toBe("ACTIVE");
	});

	it("reject chama PUT na URL correta", async () => {
		const rejected = { ...professional, status: "REJECTED" };
		mockPut.mockResolvedValueOnce({ data: rejected });

		const result = await professionalApplicationsApi.reject("prof-1");

		expect(mockPut).toHaveBeenCalledWith("/professionals/prof-1/reject");
		expect(result.status).toBe("REJECTED");
	});
});
