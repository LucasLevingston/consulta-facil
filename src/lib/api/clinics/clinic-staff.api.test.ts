import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { clinicStaffApi } from "./clinic-staff.api";

const mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);
const mockDelete = vi.mocked(api.delete);

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

	it("propaga erro 404 quando a clínica não existe", async () => {
		const error = Object.assign(new Error("Not Found"), {
			response: { status: 404 },
		});
		mockGet.mockRejectedValueOnce(error);

		await expect(
			clinicStaffApi.getReceptionists("clinic-inexistente"),
		).rejects.toThrow("Not Found");
	});
});

// ── inviteReceptionist ───────────────────────────────────────────────────────

describe("clinicStaffApi — inviteReceptionist", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama POST /clinics/:clinicId/receptionists com o email e retorna o recepcionista criado", async () => {
		mockPost.mockResolvedValueOnce({ data: receptionist });

		const result = await clinicStaffApi.inviteReceptionist("clinic-1", {
			email: "ana@test.com",
		});

		expect(mockPost).toHaveBeenCalledWith("/clinics/clinic-1/receptionists", {
			email: "ana@test.com",
		});
		expect(result).toEqual(receptionist);
	});
});

// ── removeReceptionist ───────────────────────────────────────────────────────

describe("clinicStaffApi — removeReceptionist", () => {
	beforeEach(() => vi.clearAllMocks());

	it("chama DELETE /clinics/:clinicId/receptionists/:receptionistId", async () => {
		mockDelete.mockResolvedValueOnce({ data: undefined });

		await clinicStaffApi.removeReceptionist("clinic-1", "rec-1");

		expect(mockDelete).toHaveBeenCalledWith(
			"/clinics/clinic-1/receptionists/rec-1",
		);
	});
});
