import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { clinicStaffApi } from "./clinic-staff.api";

const mockGet = vi.mocked(api.get);

const receptionist = { id: "rec-1", name: "Maria", email: "maria@clinica.com" };

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
