import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), put: vi.fn() },
}));

import { api } from "@/config/api";
import { patientHealthApi } from "./patient-health.api";

const mockGet = vi.mocked(api.get);
const mockPut = vi.mocked(api.put);

const medicalRecord = {
	id: "mr-1",
	allergies: "Dipirona",
	currentMedication: "Losartana",
	familyMedicalHistory: "Diabetes",
	pastMedicalHistory: "Apendicite",
	treatmentConsent: true,
	disclosureConsent: true,
	privacyConsent: true,
	updatedAt: "2026-05-01T00:00:00Z",
};

describe("patientHealthApi", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("getMedicalRecords", () => {
		it("chama GET /patients/:userId/medical-records e retorna o prontuário", async () => {
			mockGet.mockResolvedValueOnce({ data: medicalRecord });

			const result = await patientHealthApi.getMedicalRecords("u-1");

			expect(mockGet).toHaveBeenCalledWith("/patients/u-1/medical-records");
			expect(result.allergies).toBe("Dipirona");
		});
	});

	describe("updateMedicalRecords", () => {
		it("chama PUT /patients/:userId/medical-records e retorna o prontuário atualizado", async () => {
			const updated = { ...medicalRecord, allergies: "Penicilina" };
			mockPut.mockResolvedValueOnce({ data: updated });

			const result = await patientHealthApi.updateMedicalRecords("u-1", {
				allergies: "Penicilina",
			});

			expect(mockPut).toHaveBeenCalledWith("/patients/u-1/medical-records", {
				allergies: "Penicilina",
			});
			expect(result.allergies).toBe("Penicilina");
		});
	});

	describe("getMedicalRecords — propagação de erro", () => {
		it("propaga erro 404 quando prontuário não encontrado", async () => {
			const error = Object.assign(new Error("Not Found"), {
				response: { status: 404 },
			});
			mockGet.mockRejectedValueOnce(error);

			await expect(patientHealthApi.getMedicalRecords("u-999")).rejects.toThrow(
				"Not Found",
			);
		});
	});
});
