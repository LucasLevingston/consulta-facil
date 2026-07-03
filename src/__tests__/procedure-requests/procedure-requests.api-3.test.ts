import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { procedureRequestsApi } from "@/lib/api/procedure-requests/procedure-requests.api";

const _mockGet = vi.mocked(api.get);
const _mockPost = vi.mocked(api.post);
const mockPut = vi.mocked(api.put);

const request = {
	id: "req-1",
	serviceId: "svc-1",
	serviceName: "Ecocardiograma",
	patientId: "pat-1",
	status: "PENDING",
	notes: "Encaminhado para avaliação",
};

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
