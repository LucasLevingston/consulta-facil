import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/api", () => ({
	api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { api } from "@/config/api";
import { professionalPortfolioApi } from "./professional-portfolio.api";

const mockPost = vi.mocked(api.post);
const mockPut = vi.mocked(api.put);
const mockDelete = vi.mocked(api.delete);

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
});
