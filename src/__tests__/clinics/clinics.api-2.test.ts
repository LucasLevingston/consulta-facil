import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { clinicsCrudApi } from "@/lib/api/clinics/clinics.api";

const mockGet = vi.mocked(api.get);
const _mockPost = vi.mocked(api.post);
const _mockPut = vi.mocked(api.put);
const _mockDelete = vi.mocked(api.delete);

const clinic = {
	id: "clinic-1",
	name: "Clínica Cardio Saúde",
	city: "São Paulo",
	state: "SP",
	latitude: -23.55,
	longitude: -46.63,
};

const _receptionist = {
	id: "rec-1",
	name: "Maria",
	email: "maria@clinica.com",
};

// ── getMy ─────────────────────────────────────────────────────────────────────

describe("clinicsCrudApi — getMy", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama endpoint correto e retorna clínicas do usuário", async () => {
		mockGet.mockResolvedValueOnce({ data: [clinic] });

		const result = await clinicsCrudApi.getMy();

		expect(mockGet).toHaveBeenCalledWith("/clinics/my");
		expect(result).toHaveLength(1);
	});

	it("retorna array vazio quando profissional não tem clínica", async () => {
		mockGet.mockResolvedValueOnce({ data: [] });

		const result = await clinicsCrudApi.getMy();

		expect(result).toEqual([]);
	});
});

// ── getNearby — parte 1 ───────────────────────────────────────────────────────

describe("clinicsCrudApi — getNearby filtros — parte 1", () => {
	beforeEach(() => vi.clearAllMocks());

	it("passa lat, lng e radiusKm para a API", async () => {
		mockGet.mockResolvedValueOnce({ data: [clinic] });

		await clinicsCrudApi.getNearby(-23.55, -46.63, 10);

		expect(mockGet).toHaveBeenCalledWith(
			"/clinics/nearby",
			expect.objectContaining({
				params: expect.objectContaining({
					lat: -23.55,
					lng: -46.63,
					radiusKm: 10,
				}),
			}),
		);
	});

	it("usa radiusKm padrão 50 quando não informado", async () => {
		mockGet.mockResolvedValueOnce({ data: [] });

		await clinicsCrudApi.getNearby(-7.12, -34.84);

		const params = (
			mockGet.mock.calls[0][1] as { params: Record<string, unknown> }
		).params;
		expect(params.radiusKm).toBe(50);
	});

	it("raio pequeno retorna menos clínicas que raio grande", async () => {
		mockGet
			.mockResolvedValueOnce({ data: [clinic] })
			.mockResolvedValueOnce({ data: [clinic, { ...clinic, id: "clinic-2" }] });

		const near = await clinicsCrudApi.getNearby(-23.55, -46.63, 5);
		const far = await clinicsCrudApi.getNearby(-23.55, -46.63, 100);

		expect(near).toHaveLength(1);
		expect(far).toHaveLength(2);
	});
});
