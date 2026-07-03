import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { procedureRequestsApi } from "@/lib/api/procedure-requests/procedure-requests.api";

const _mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);
const _mockPut = vi.mocked(api.put);

const request = {
	id: "req-1",
	serviceId: "svc-1",
	serviceName: "Ecocardiograma",
	patientId: "pat-1",
	status: "PENDING",
	notes: "Encaminhado para avaliação",
};

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
