import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { clinicStaffApi } from "@/lib/api/clinics/clinic-staff.api";
import { clinicsCrudApi } from "@/lib/api/clinics/clinics.api";

const mockGet = vi.mocked(api.get);
const _mockPost = vi.mocked(api.post);
const _mockPut = vi.mocked(api.put);
const _mockDelete = vi.mocked(api.delete);

const _clinic = {
	id: "clinic-1",
	name: "Clínica Cardio Saúde",
	city: "São Paulo",
	state: "SP",
	latitude: -23.55,
	longitude: -46.63,
};

const receptionist = { id: "rec-1", name: "Maria", email: "maria@clinica.com" };

// ── getNearby — parte 2 ───────────────────────────────────────────────────────

describe("clinicsCrudApi — getNearby filtros — parte 2", () => {
	beforeEach(() => vi.clearAllMocks());

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

// ── getReceptionists ──────────────────────────────────────────────────────────

describe("clinicStaffApi — getReceptionists", () => {
	beforeEach(() => vi.clearAllMocks());

	it("busca recepcionistas pelo clinicId correto", async () => {
		mockGet.mockResolvedValueOnce({ data: [receptionist] });

		const result = await clinicStaffApi.getReceptionists("clinic-1");

		expect(mockGet).toHaveBeenCalledWith("/clinics/clinic-1/receptionists");
		expect(result).toHaveLength(1);
		expect(result[0].email).toBe("maria@clinica.com");
	});

	it("clínica sem recepcionistas retorna array vazio", async () => {
		mockGet.mockResolvedValueOnce({ data: [] });

		const result = await clinicStaffApi.getReceptionists("clinic-1");

		expect(result).toEqual([]);
	});

	it("retorna múltiplos recepcionistas", async () => {
		const recs = [receptionist, { ...receptionist, id: "rec-2", name: "João" }];
		mockGet.mockResolvedValueOnce({ data: recs });

		const result = await clinicStaffApi.getReceptionists("clinic-1");

		expect(result).toHaveLength(2);
	});
});
