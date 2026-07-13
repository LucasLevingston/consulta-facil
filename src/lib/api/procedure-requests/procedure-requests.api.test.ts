import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { procedureRequestsApi } from "./procedure-requests.api";

const mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);
const mockPut = vi.mocked(api.put);

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

// ── create ────────────────────────────────────────────────────────────────────

describe("procedureRequestsApi — create", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama POST com payload correto", async () => {
		mockPost.mockResolvedValueOnce({ data: request });

		const input = {
			serviceId: "svc-1",
			patientId: "pat-1",
			notes: "Encaminhado para avaliação",
		} as Parameters<typeof procedureRequestsApi.create>[0];

		await procedureRequestsApi.create(input);

		expect(mockPost).toHaveBeenCalledWith("/procedure-requests", input);
	});

	it("retorna solicitação criada com status PENDING", async () => {
		mockPost.mockResolvedValueOnce({ data: request });

		const result = await procedureRequestsApi.create({
			serviceId: "svc-1",
			patientId: "pat-1",
		} as Parameters<typeof procedureRequestsApi.create>[0]);

		expect(result.status).toBe("PENDING");
	});
});

// ── schedule ──────────────────────────────────────────────────────────────────

describe("procedureRequestsApi — schedule agendamento", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama POST no requestId correto com payload", async () => {
		const scheduled = { ...request, status: "SCHEDULED" };
		mockPost.mockResolvedValueOnce({ data: scheduled });

		const input = {
			scheduledAt: "2026-07-01T10:00:00",
		} as Parameters<typeof procedureRequestsApi.schedule>[1];

		await procedureRequestsApi.schedule("req-1", input);

		expect(mockPost).toHaveBeenCalledWith(
			"/procedure-requests/req-1/schedule",
			input,
		);
	});

	it("IDs diferentes produzem URLs diferentes", async () => {
		mockPost
			.mockResolvedValueOnce({ data: { ...request, status: "SCHEDULED" } })
			.mockResolvedValueOnce({
				data: { ...request, id: "req-2", status: "SCHEDULED" },
			});

		const input = { scheduledAt: "2026-07-01T10:00:00" } as Parameters<
			typeof procedureRequestsApi.schedule
		>[1];
		await procedureRequestsApi.schedule("req-1", input);
		await procedureRequestsApi.schedule("req-2", input);

		expect(mockPost.mock.calls[0][0]).toBe(
			"/procedure-requests/req-1/schedule",
		);
		expect(mockPost.mock.calls[1][0]).toBe(
			"/procedure-requests/req-2/schedule",
		);
	});
});

// ── cancel ────────────────────────────────────────────────────────────────────

describe("procedureRequestsApi — cancel", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama PUT no requestId correto", async () => {
		const cancelled = { ...request, status: "CANCELLED" };
		mockPut.mockResolvedValueOnce({ data: cancelled });

		const result = await procedureRequestsApi.cancel("req-1");

		expect(mockPut).toHaveBeenCalledWith("/procedure-requests/req-1/cancel");
		expect(result.status).toBe("CANCELLED");
	});
});
