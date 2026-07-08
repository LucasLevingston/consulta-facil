import { professionalPortfolioApi } from "@/lib/api/professionals/professional-portfolio.api";
import type { ProfessionalCertificateInput } from "@/lib/schemas/professional/professional-certificate.schema";
import type { ProfessionalEducationInput } from "@/lib/schemas/professional/professional-education.schema";
import type { ProfessionalExperienceInput } from "@/lib/schemas/professional/professional-experience.schema";
import type { ProfessionalResponse } from "@/lib/schemas/professional/professional-response.schema";

export const professionalPortfolioRepository = {
	addEducation: (
		data: ProfessionalEducationInput,
	): Promise<ProfessionalResponse> =>
		professionalPortfolioApi.addEducation(data),

	updateEducation: (
		educationId: string,
		data: ProfessionalEducationInput,
	): Promise<ProfessionalResponse> =>
		professionalPortfolioApi.updateEducation(educationId, data),

	deleteEducation: (educationId: string): Promise<ProfessionalResponse> =>
		professionalPortfolioApi.deleteEducation(educationId),

	addExperience: (
		data: ProfessionalExperienceInput,
	): Promise<ProfessionalResponse> =>
		professionalPortfolioApi.addExperience(data),

	updateExperience: (
		experienceId: string,
		data: ProfessionalExperienceInput,
	): Promise<ProfessionalResponse> =>
		professionalPortfolioApi.updateExperience(experienceId, data),

	deleteExperience: (experienceId: string): Promise<ProfessionalResponse> =>
		professionalPortfolioApi.deleteExperience(experienceId),

	addCertificate: (
		data: ProfessionalCertificateInput,
	): Promise<ProfessionalResponse> =>
		professionalPortfolioApi.addCertificate(data),

	updateCertificate: (
		certificateId: string,
		data: ProfessionalCertificateInput,
	): Promise<ProfessionalResponse> =>
		professionalPortfolioApi.updateCertificate(certificateId, data),

	deleteCertificate: (certificateId: string): Promise<ProfessionalResponse> =>
		professionalPortfolioApi.deleteCertificate(certificateId),
};
