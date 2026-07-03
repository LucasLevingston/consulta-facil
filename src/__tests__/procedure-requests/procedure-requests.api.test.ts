import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { procedureRequestsApi } from "@/lib/api/procedure-requests/procedure-requests.api";

const mockGet = vi.mocked(api.get);

const request = {
	id: "req-1",
	serviceId: "svc-1",
	serviceName: "Ecocardiograma",
	patientId: "pat-1",
	status: "PENDING",
	notes: "Encaminhado para avaliação",
};

// ── getMine — lista com filtro de role ────────────────────────────────────────

describe("procedureRequestsApi — getMine lista de solicitações", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama endpoint correto", async () => {
		mockGet.mockResolvedValueOnce({ data: [request] });

		await procedureRequestsApi.getMine();

		expect(mockGet).toHaveBeenCalledWith("/procedure-requests/mine");
	});

	it("retorna todas as solicitações do usuário", async () => {
		const requests = [
			request,
			{ ...request, id: "req-2", serviceName: "Holter 24h" },
		];
		mockGet.mockResolvedValueOnce({ data: requests });

		const result = await procedureRequestsApi.getMine();

		expect(result).toHaveLength(2);
		expect(result.map((r) => r.serviceName)).toContain("Holter 24h");
	});

	it("retorna array vazio quando não há solicitações", async () => {
		mockGet.mockResolvedValueOnce({ data: [] });

		const result = await procedureRequestsApi.getMine();

		expect(result).toEqual([]);
	});

	it("retorna solicitações com diferentes status", async () => {
		const requests = [
			request,
			{ ...request, id: "req-2", status: "APPROVED" },
			{ ...request, id: "req-3", status: "SCHEDULED" },
			{ ...request, id: "req-4", status: "CANCELLED" },
		];
		mockGet.mockResolvedValueOnce({ data: requests });

		const result = await procedureRequestsApi.getMine();

		const statuses = result.map((r) => r.status);
		expect(statuses).toContain("PENDING");
		expect(statuses).toContain("APPROVED");
		expect(statuses).toContain("SCHEDULED");
		expect(statuses).toContain("CANCELLED");
	});

	it("resposta contém serviceId e patientId", async () => {
		mockGet.mockResolvedValueOnce({ data: [request] });

		const result = await procedureRequestsApi.getMine();

		expect(result[0].serviceId).toBe("svc-1");
		expect(result[0].patientId).toBe("pat-1");
	});
});
