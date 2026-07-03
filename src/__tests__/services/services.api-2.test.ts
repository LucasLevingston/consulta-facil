import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { professionalServicesApi } from "@/lib/api/services/professional-services.api";

const _mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);
const mockPut = vi.mocked(api.put);
const mockDelete = vi.mocked(api.delete);

const service = {
	id: "svc-1",
	name: "Consulta de Cardiologia",
	description: "Consulta clínica",
	price: 250,
	durationMinutes: 30,
	requiresConsultation: false,
	active: true,
};

// ── create ────────────────────────────────────────────────────────────────────

describe("servicesApi — create", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama POST /professional-services com payload", async () => {
		mockPost.mockResolvedValueOnce({ data: service });

		const input = {
			name: "Consulta",
			price: 200,
			durationMinutes: 30,
			requiresConsultation: false,
		} as Parameters<typeof professionalServicesApi.create>[0];

		await professionalServicesApi.create(input);

		expect(mockPost).toHaveBeenCalledWith("/professional-services", input);
	});
});

// ── update ────────────────────────────────────────────────────────────────────

describe("servicesApi — update", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama PUT no serviceId correto", async () => {
		mockPut.mockResolvedValueOnce({ data: { ...service, price: 300 } });

		const result = await professionalServicesApi.update("svc-1", {
			name: "Consulta",
			price: 300,
			durationMinutes: 30,
			requiresConsultation: false,
		});

		expect(mockPut).toHaveBeenCalledWith(
			"/professional-services/svc-1",
			expect.objectContaining({ price: 300 }),
		);
		expect(result.price).toBe(300);
	});
});

// ── deactivate ────────────────────────────────────────────────────────────────

describe("servicesApi — deactivate", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama DELETE no serviceId correto", async () => {
		mockDelete.mockResolvedValueOnce({ data: undefined });

		await professionalServicesApi.deactivate("svc-1");

		expect(mockDelete).toHaveBeenCalledWith("/professional-services/svc-1");
	});
});
