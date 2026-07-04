import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		patch: vi.fn(),
		delete: vi.fn(),
	},
}));

import { api } from "@/config/api";
import { clinicStaffApi } from "@/lib/api/clinics/clinic-staff.api";
import { professionalPortfolioApi } from "@/lib/api/professionals/professional-portfolio.api";
import { professionalProfileApi } from "@/lib/api/professionals/professional-profile.api";

const mockPost = vi.mocked(api.post);
const mockPut = vi.mocked(api.put);
const mockPatch = vi.mocked(api.patch);
const mockDelete = vi.mocked(api.delete);
const mockGet = vi.mocked(api.get);

const professional = {
	id: "prof-1",
	userId: "u-1",
	name: "Dr. João",
	email: "joao@test.com",
	profession: "MEDICO",
	specialty: "CARDIOLOGIA",
	licenseNumber: "12345",
	phone: "11988887777",
	imageUrl: null,
	rating: 4.8,
	consultationCount: 10,
	status: "APPROVED",
	city: "São Paulo",
	state: "SP",
	address: null,
	latitude: null,
	longitude: null,
	clinicId: null,
	clinicName: null,
	consultationPrice: 200,
	acceptedPaymentMethods: [],
	paymentTiming: null,
	instagramUrl: null,
	linkedinUrl: null,
	websiteUrl: null,
	facebookUrl: null,
	bio: "Cardiologista experiente",
	councilType: "CRM",
	councilState: "SP",
	zipCode: null,
	neighborhood: null,
	streetNumber: null,
	complement: null,
	education: [],
	experience: [],
	certificates: [],
};

const receptionist = {
	id: "rec-1",
	userId: "u-2",
	name: "Ana Recepcionista",
	email: "ana@test.com",
	createdAt: "2026-05-01T00:00:00Z",
};

describe("professionalPortfolioApi", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("addEducation", () => {
		it("chama POST /professionals/me/education com os dados e retorna o perfil atualizado", async () => {
			mockPost.mockResolvedValueOnce({ data: professional });

			const result = await professionalPortfolioApi.addEducation({
				degree: "Graduação",
				institution: "USP",
				fieldOfStudy: "Medicina",
				graduationYear: 2010,
			});

			expect(mockPost).toHaveBeenCalledWith("/professionals/me/education", {
				degree: "Graduação",
				institution: "USP",
				fieldOfStudy: "Medicina",
				graduationYear: 2010,
			});
			expect(result).toEqual(professional);
		});
	});

	describe("updateEducation", () => {
		it("chama PUT /professionals/me/education/:id com os dados", async () => {
			mockPut.mockResolvedValueOnce({ data: professional });

			await professionalPortfolioApi.updateEducation("edu-1", {
				degree: "Mestrado",
				institution: "USP",
			});

			expect(mockPut).toHaveBeenCalledWith(
				"/professionals/me/education/edu-1",
				{ degree: "Mestrado", institution: "USP" },
			);
		});
	});

	describe("deleteEducation", () => {
		it("chama DELETE /professionals/me/education/:id e retorna o perfil atualizado", async () => {
			mockDelete.mockResolvedValueOnce({ data: professional });

			const result = await professionalPortfolioApi.deleteEducation("edu-1");

			expect(mockDelete).toHaveBeenCalledWith(
				"/professionals/me/education/edu-1",
			);
			expect(result).toEqual(professional);
		});
	});

	describe("addExperience", () => {
		it("chama POST /professionals/me/experience com os dados", async () => {
			mockPost.mockResolvedValueOnce({ data: professional });

			await professionalPortfolioApi.addExperience({
				position: "Médico Plantonista",
				institution: "Hospital X",
				startYear: 2015,
			});

			expect(mockPost).toHaveBeenCalledWith("/professionals/me/experience", {
				position: "Médico Plantonista",
				institution: "Hospital X",
				startYear: 2015,
			});
		});
	});

	describe("updateExperience", () => {
		it("chama PUT /professionals/me/experience/:id com os dados", async () => {
			mockPut.mockResolvedValueOnce({ data: professional });

			await professionalPortfolioApi.updateExperience("exp-1", {
				position: "Médico Chefe",
				institution: "Hospital X",
				startYear: 2015,
				endYear: 2020,
			});

			expect(mockPut).toHaveBeenCalledWith(
				"/professionals/me/experience/exp-1",
				{
					position: "Médico Chefe",
					institution: "Hospital X",
					startYear: 2015,
					endYear: 2020,
				},
			);
		});
	});

	describe("deleteExperience", () => {
		it("chama DELETE /professionals/me/experience/:id", async () => {
			mockDelete.mockResolvedValueOnce({ data: professional });

			await professionalPortfolioApi.deleteExperience("exp-1");

			expect(mockDelete).toHaveBeenCalledWith(
				"/professionals/me/experience/exp-1",
			);
		});
	});

	describe("addCertificate", () => {
		it("chama POST /professionals/me/certificates com os dados", async () => {
			mockPost.mockResolvedValueOnce({ data: professional });

			await professionalPortfolioApi.addCertificate({
				title: "Certificado ACLS",
				issuingOrganization: "AHA",
				issueYear: 2022,
				certificateUrl: "https://cert.com/acls",
			});

			expect(mockPost).toHaveBeenCalledWith("/professionals/me/certificates", {
				title: "Certificado ACLS",
				issuingOrganization: "AHA",
				issueYear: 2022,
				certificateUrl: "https://cert.com/acls",
			});
		});
	});

	describe("updateCertificate", () => {
		it("chama PUT /professionals/me/certificates/:id com os dados", async () => {
			mockPut.mockResolvedValueOnce({ data: professional });

			await professionalPortfolioApi.updateCertificate("cert-1", {
				title: "Certificado BLS",
			});

			expect(mockPut).toHaveBeenCalledWith(
				"/professionals/me/certificates/cert-1",
				{ title: "Certificado BLS" },
			);
		});
	});

	describe("deleteCertificate", () => {
		it("chama DELETE /professionals/me/certificates/:id", async () => {
			mockDelete.mockResolvedValueOnce({ data: professional });

			await professionalPortfolioApi.deleteCertificate("cert-1");

			expect(mockDelete).toHaveBeenCalledWith(
				"/professionals/me/certificates/cert-1",
			);
		});
	});

	describe("addEducation — propagação de erro", () => {
		it("propaga erro 400 quando os dados são inválidos", async () => {
			const error = Object.assign(new Error("Bad Request"), {
				response: { status: 400 },
			});
			mockPost.mockRejectedValueOnce(error);

			await expect(
				professionalPortfolioApi.addEducation({
					degree: "",
					institution: "",
				}),
			).rejects.toThrow("Bad Request");
		});
	});
});

describe("professionalProfileApi", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("update", () => {
		it("chama PUT /professionals/:id com os dados e retorna o profissional atualizado", async () => {
			mockPut.mockResolvedValueOnce({ data: professional });

			const result = await professionalProfileApi.update("prof-1", {
				profession: "MEDICO",
				specialty: "CARDIOLOGIA",
				licenseNumber: "12345",
			});

			expect(mockPut).toHaveBeenCalledWith("/professionals/prof-1", {
				profession: "MEDICO",
				specialty: "CARDIOLOGIA",
				licenseNumber: "12345",
			});
			expect(result).toEqual(professional);
		});
	});

	describe("delete", () => {
		it("chama DELETE /professionals/:id", async () => {
			mockDelete.mockResolvedValueOnce({ data: undefined });

			await professionalProfileApi.delete("prof-1");

			expect(mockDelete).toHaveBeenCalledWith("/professionals/prof-1");
		});
	});

	describe("updateBio", () => {
		it("chama PATCH /professionals/me/bio com os dados", async () => {
			mockPatch.mockResolvedValueOnce({ data: professional });

			await professionalProfileApi.updateBio({ bio: "Nova bio" });

			expect(mockPatch).toHaveBeenCalledWith("/professionals/me/bio", {
				bio: "Nova bio",
			});
		});
	});

	describe("updateSocialLinks", () => {
		it("chama PATCH /professionals/me/social-links com os dados", async () => {
			mockPatch.mockResolvedValueOnce({ data: professional });

			await professionalProfileApi.updateSocialLinks({
				instagramUrl: "https://instagram.com/dr.joao",
			});

			expect(mockPatch).toHaveBeenCalledWith("/professionals/me/social-links", {
				instagramUrl: "https://instagram.com/dr.joao",
			});
		});
	});

	describe("updateCouncil", () => {
		it("chama PATCH /professionals/me/council com os dados", async () => {
			mockPatch.mockResolvedValueOnce({ data: professional });

			await professionalProfileApi.updateCouncil({
				councilType: "CRM",
				councilState: "SP",
			});

			expect(mockPatch).toHaveBeenCalledWith("/professionals/me/council", {
				councilType: "CRM",
				councilState: "SP",
			});
		});
	});

	describe("updateAddress", () => {
		it("chama PATCH /professionals/me/address com os dados", async () => {
			mockPatch.mockResolvedValueOnce({ data: professional });

			await professionalProfileApi.updateAddress({
				city: "São Paulo",
				state: "SP",
			});

			expect(mockPatch).toHaveBeenCalledWith("/professionals/me/address", {
				city: "São Paulo",
				state: "SP",
			});
		});
	});

	describe("update — propagação de erro", () => {
		it("propaga erro 403 quando o usuário não tem permissão", async () => {
			const error = Object.assign(new Error("Forbidden"), {
				response: { status: 403 },
			});
			mockPut.mockRejectedValueOnce(error);

			await expect(
				professionalProfileApi.update("prof-1", {
					profession: "MEDICO",
					specialty: "CARDIOLOGIA",
					licenseNumber: "12345",
				}),
			).rejects.toThrow("Forbidden");
		});
	});
});

describe("clinicStaffApi", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("getReceptionists", () => {
		it("chama GET /clinics/:clinicId/receptionists e retorna a lista", async () => {
			mockGet.mockResolvedValueOnce({ data: [receptionist] });

			const result = await clinicStaffApi.getReceptionists("clinic-1");

			expect(mockGet).toHaveBeenCalledWith("/clinics/clinic-1/receptionists");
			expect(result).toEqual([receptionist]);
		});
	});

	describe("inviteReceptionist", () => {
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

	describe("removeReceptionist", () => {
		it("chama DELETE /clinics/:clinicId/receptionists/:receptionistId", async () => {
			mockDelete.mockResolvedValueOnce({ data: undefined });

			await clinicStaffApi.removeReceptionist("clinic-1", "rec-1");

			expect(mockDelete).toHaveBeenCalledWith(
				"/clinics/clinic-1/receptionists/rec-1",
			);
		});
	});

	describe("getReceptionists — propagação de erro", () => {
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
});
