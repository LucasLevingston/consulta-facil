import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { clinicQueueApi } from "./clinic-queue.api";

const mockGet = vi.mocked(api.get);

// ── getQueue ──────────────────────────────────────────────────────────────────

describe("clinicQueueApi — getQueue", () => {
	beforeEach(() => vi.clearAllMocks());

	const appointment = { id: "apt-1", status: "CONFIRMED" };

	it("busca fila pelo clinicId correto", async () => {
		mockGet.mockResolvedValueOnce({ data: [appointment] });

		const result = await clinicQueueApi.getQueue("clinic-1");

		expect(mockGet).toHaveBeenCalledWith("/clinics/clinic-1/queue");
		expect(result).toHaveLength(1);
	});

	it("fila vazia retorna array vazio", async () => {
		mockGet.mockResolvedValueOnce({ data: [] });

		const result = await clinicQueueApi.getQueue("clinic-1");

		expect(result).toEqual([]);
	});
});
