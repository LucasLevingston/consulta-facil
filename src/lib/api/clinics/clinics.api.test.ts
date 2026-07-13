import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { clinicsCrudApi } from "./clinics.api";

const mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);
const mockPut = vi.mocked(api.put);
const mockDelete = vi.mocked(api.delete);

const clinic = {
	id: "clinic-1",
	name: "Clínica Cardio Saúde",
	city: "São Paulo",
	state: "SP",
	latitude: -23.55,
	longitude: -46.63,
};

// ── getAll ────────────────────────────────────────────────────────────────────

describe("clinicsCrudApi — getAll", () => {
	beforeEach(() => vi.clearAllMocks());

	it("retorna lista de clínicas", async () => {
		mockGet.mockResolvedValueOnce({ data: [clinic] });

		const result = await clinicsCrudApi.getAll();

		expect(mockGet).toHaveBeenCalledWith("/clinics");
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe("Clínica Cardio Saúde");
	});

	it("retorna array vazio quando não há clínicas", async () => {
		mockGet.mockResolvedValueOnce({ data: [] });

		const result = await clinicsCrudApi.getAll();

		expect(result).toEqual([]);
	});

	it("retorna múltiplas clínicas", async () => {
		const clinics = [clinic, { ...clinic, id: "clinic-2", name: "Saúde Sul" }];
		mockGet.mockResolvedValueOnce({ data: clinics });

		const result = await clinicsCrudApi.getAll();

		expect(result).toHaveLength(2);
	});
});

// ── getById ───────────────────────────────────────────────────────────────────

describe("clinicsCrudApi — getById", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca clínica pelo ID correto", async () => {
		mockGet.mockResolvedValueOnce({ data: clinic });

		const result = await clinicsCrudApi.getById("clinic-1");

		expect(mockGet).toHaveBeenCalledWith("/clinics/clinic-1");
		expect(result.id).toBe("clinic-1");
	});

	it("IDs diferentes produzem chamadas diferentes", async () => {
		mockGet
			.mockResolvedValueOnce({ data: clinic })
			.mockResolvedValueOnce({ data: { ...clinic, id: "clinic-2" } });

		await clinicsCrudApi.getById("clinic-1");
		await clinicsCrudApi.getById("clinic-2");

		expect(mockGet.mock.calls[0][0]).toBe("/clinics/clinic-1");
		expect(mockGet.mock.calls[1][0]).toBe("/clinics/clinic-2");
	});
});

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

// ── getNearby ─────────────────────────────────────────────────────────────────

describe("clinicsCrudApi — getNearby filtros", () => {
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

	it("coordenadas diferentes passam valores corretos", async () => {
		mockGet.mockResolvedValueOnce({ data: [] });

		await clinicsCrudApi.getNearby(-7.12, -34.84, 25);

		const params = (
			mockGet.mock.calls[0][1] as { params: Record<string, unknown> }
		).params;
		expect(params.lat).toBe(-7.12);
		expect(params.lng).toBe(-34.84);
		expect(params.radiusKm).toBe(25);
	});

	it("retorna array vazio quando nenhuma clínica no raio", async () => {
		mockGet.mockResolvedValueOnce({ data: [] });

		const result = await clinicsCrudApi.getNearby(-90, 0, 1);

		expect(result).toEqual([]);
	});
});

// ── CRUD ──────────────────────────────────────────────────────────────────────

describe("clinicsCrudApi — create e update", () => {
	beforeEach(() => vi.clearAllMocks());

	const input = {
		name: "Nova Clínica",
		city: "Recife",
		state: "PE",
	} as Parameters<typeof clinicsCrudApi.create>[0];

	it("create chama POST /clinics com payload correto", async () => {
		mockPost.mockResolvedValueOnce({ data: { ...clinic, ...input } });

		await clinicsCrudApi.create(input);

		expect(mockPost).toHaveBeenCalledWith("/clinics", input);
	});

	it("update chama PUT /clinics/:id com payload correto", async () => {
		mockPut.mockResolvedValueOnce({ data: { ...clinic, ...input } });

		await clinicsCrudApi.update("clinic-1", input);

		expect(mockPut).toHaveBeenCalledWith("/clinics/clinic-1", input);
	});

	it("addMember chama POST no endpoint correto", async () => {
		mockPost.mockResolvedValueOnce({ data: undefined });

		await clinicsCrudApi.addMember("clinic-1", "prof-1");

		expect(mockPost).toHaveBeenCalledWith("/clinics/clinic-1/members/prof-1");
	});

	it("removeMember chama DELETE no endpoint correto", async () => {
		mockDelete.mockResolvedValueOnce({ data: undefined });

		await clinicsCrudApi.removeMember("clinic-1", "prof-1");

		expect(mockDelete).toHaveBeenCalledWith("/clinics/clinic-1/members/prof-1");
	});
});
