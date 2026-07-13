import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { patientVaccinesApi } from "./patient-vaccines.api";

const mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);
const mockDelete = vi.mocked(api.delete);

const vaccine = {
	id: "vac-1",
	vaccineName: "Gripe",
	doseNumber: "1",
	administeredAt: "2026-04-01",
	notes: "Sem reações",
};

describe("patientVaccinesApi", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("listVaccines", () => {
		it("chama GET /patients/me/vaccines e retorna a lista de vacinas", async () => {
			mockGet.mockResolvedValueOnce({ data: [vaccine] });

			const result = await patientVaccinesApi.listVaccines();

			expect(mockGet).toHaveBeenCalledWith("/patients/me/vaccines");
			expect(result).toEqual([vaccine]);
		});

		it("retorna lista vazia quando o paciente não possui vacinas", async () => {
			mockGet.mockResolvedValueOnce({ data: [] });

			const result = await patientVaccinesApi.listVaccines();

			expect(result).toEqual([]);
		});
	});

	describe("addVaccine", () => {
		it("chama POST /patients/me/vaccines com os dados e retorna a vacina criada", async () => {
			mockPost.mockResolvedValueOnce({ data: vaccine });

			const result = await patientVaccinesApi.addVaccine({
				vaccineName: "Gripe",
				doseNumber: "1",
				administeredAt: "2026-04-01",
				notes: "Sem reações",
			});

			expect(mockPost).toHaveBeenCalledWith("/patients/me/vaccines", {
				vaccineName: "Gripe",
				doseNumber: "1",
				administeredAt: "2026-04-01",
				notes: "Sem reações",
			});
			expect(result).toEqual(vaccine);
		});

		it("propaga erro 500 quando o backend falha ao salvar", async () => {
			const error = Object.assign(new Error("Internal Server Error"), {
				response: { status: 500 },
			});
			mockPost.mockRejectedValueOnce(error);

			await expect(
				patientVaccinesApi.addVaccine({ vaccineName: "Febre Amarela" }),
			).rejects.toThrow("Internal Server Error");
		});
	});

	describe("deleteVaccine", () => {
		it("chama DELETE /patients/me/vaccines/:id", async () => {
			mockDelete.mockResolvedValueOnce({ data: undefined });

			await patientVaccinesApi.deleteVaccine("vac-1");

			expect(mockDelete).toHaveBeenCalledWith("/patients/me/vaccines/vac-1");
		});
	});
});
