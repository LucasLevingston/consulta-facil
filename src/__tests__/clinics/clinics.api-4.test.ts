import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { clinicQueueApi } from "@/lib/api/clinics/clinic-queue.api";
import { clinicsCrudApi } from "@/lib/api/clinics/clinics.api";

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

const _receptionist = {
	id: "rec-1",
	name: "Maria",
	email: "maria@clinica.com",
};

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
