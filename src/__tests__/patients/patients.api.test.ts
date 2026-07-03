import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), put: vi.fn() },
}));

import { api } from "@/config/api";
import { patientHealthApi } from "@/lib/api/patients/patient-health.api";
import { patientProfileApi } from "@/lib/api/patients/patient-profile.api";

const mockGet = vi.mocked(api.get);
const mockPut = vi.mocked(api.put);

const profile = {
	userId: "u-1",
	name: "Maria Silva",
	email: "maria@test.com",
	phone: "11988887777",
};

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

const patientSummaryPage = {
	content: [
		{
			id: "p-1",
			name: "Maria Silva",
			lastAppointment: "2026-05-10T10:00:00",
			totalAppointments: 3,
		},
	],
	totalElements: 1,
	totalPages: 1,
	number: 0,
};

describe("patientProfileApi", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("getMyProfile", () => {
		it("chama GET /patients/me e retorna o perfil", async () => {
			mockGet.mockResolvedValueOnce({ data: profile });

			const result = await patientProfileApi.getMyProfile();

			expect(mockGet).toHaveBeenCalledWith("/patients/me");
			expect(result.userId).toBe("u-1");
		});
	});

	describe("getProfile", () => {
		it("chama GET /patients/:userId e retorna o perfil do usuário", async () => {
			mockGet.mockResolvedValueOnce({ data: profile });

			const result = await patientProfileApi.getProfile("u-1");

			expect(mockGet).toHaveBeenCalledWith("/patients/u-1");
			expect(result.name).toBe("Maria Silva");
		});
	});

	describe("updateMyProfile", () => {
		it("chama PUT /patients/me e retorna o perfil atualizado", async () => {
			const updated = { ...profile, occupation: "Engenheiro" };
			mockPut.mockResolvedValueOnce({ data: updated });

			const result = await patientProfileApi.updateMyProfile({
				occupation: "Engenheiro",
			});

			expect(mockPut).toHaveBeenCalledWith("/patients/me", {
				occupation: "Engenheiro",
			});
			expect(result.occupation).toBe("Engenheiro");
		});
	});

	describe("getProfessionalPatients", () => {
		it("chama GET /patients/professional/:professionalId com os params e retorna a página", async () => {
			mockGet.mockResolvedValueOnce({ data: patientSummaryPage });

			const result = await patientProfileApi.getProfessionalPatients("d-1", {
				page: 0,
				size: 20,
				search: "",
				sort: "recent",
			});

			expect(mockGet).toHaveBeenCalledWith("/patients/professional/d-1", {
				params: { page: 0, size: 20, search: "", sort: "recent" },
			});
			expect(result.content).toHaveLength(1);
			expect(result.content[0].name).toBe("Maria Silva");
		});

		it("passa parâmetros de busca e sort corretamente", async () => {
			mockGet.mockResolvedValueOnce({ data: patientSummaryPage });

			await patientProfileApi.getProfessionalPatients("d-1", {
				page: 1,
				size: 10,
				search: "Maria",
				sort: "name",
			});

			expect(mockGet).toHaveBeenCalledWith("/patients/professional/d-1", {
				params: { page: 1, size: 10, search: "Maria", sort: "name" },
			});
		});

		it("retorna página vazia quando nenhum paciente encontrado", async () => {
			const emptyPage = {
				content: [],
				totalElements: 0,
				totalPages: 0,
				number: 0,
			};
			mockGet.mockResolvedValueOnce({ data: emptyPage });

			const result = await patientProfileApi.getProfessionalPatients("d-1", {
				search: "NaoExiste",
			});

			expect(result.content).toHaveLength(0);
			expect(result.totalElements).toBe(0);
		});

		it("propaga erro 404 quando o userId do profissional não existe no backend", async () => {
			const error = Object.assign(new Error("Not Found"), {
				response: { status: 404 },
			});
			mockGet.mockRejectedValueOnce(error);

			await expect(
				patientProfileApi.getProfessionalPatients("id-inexistente", {
					page: 0,
					size: 10,
				}),
			).rejects.toThrow("Not Found");
			expect(mockGet).toHaveBeenCalledWith(
				"/patients/professional/id-inexistente",
				expect.anything(),
			);
		});

		it("envia o ID passado diretamente no path da URL", async () => {
			mockGet.mockResolvedValueOnce({ data: patientSummaryPage });

			await patientProfileApi.getProfessionalPatients("user-abc-xyz", {
				page: 0,
				size: 10,
			});

			expect(mockGet).toHaveBeenCalledWith(
				"/patients/professional/user-abc-xyz",
				expect.anything(),
			);
		});
	});

	describe("getMyProfile — propagação de erro", () => {
		it("propaga erro 401 quando não autenticado", async () => {
			const error = Object.assign(new Error("Unauthorized"), {
				response: { status: 401 },
			});
			mockGet.mockRejectedValueOnce(error);

			await expect(patientProfileApi.getMyProfile()).rejects.toThrow(
				"Unauthorized",
			);
		});
	});
});

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
