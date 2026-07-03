import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { clinicsCrudApi } from "@/lib/api/clinics/clinics.api";

const mockGet = vi.mocked(api.get);

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
