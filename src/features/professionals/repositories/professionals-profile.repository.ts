import { professionalPortfolioApi } from "@/lib/api/professionals/professional-portfolio.api";
import { professionalProfileApi } from "@/lib/api/professionals/professional-profile.api";
import type { CreateProfessionalInput } from "@/lib/schemas/doctor/create-professional.schema";
import type { ProfessionalCertificateInput } from "@/lib/schemas/doctor/professional-certificate.schema";
import type { ProfessionalEducationInput } from "@/lib/schemas/doctor/professional-education.schema";
import type { ProfessionalExperienceInput } from "@/lib/schemas/doctor/professional-experience.schema";
import type { ProfessionalResponse } from "@/lib/schemas/doctor/professional-response.schema";
import type { UpdateAddressInput } from "@/lib/schemas/doctor/update-address.schema";
import type { UpdateBioInput } from "@/lib/schemas/doctor/update-bio.schema";
import type { UpdateCouncilInput } from "@/lib/schemas/doctor/update-council.schema";
import type { UpdateSocialLinksInput } from "@/lib/schemas/doctor/update-social-links.schema";

export const professionalsProfileRepo = {
	update: async (
		professionalId: string,
		data: CreateProfessionalInput,
	): Promise<ProfessionalResponse> =>
		professionalProfileApi.update(professionalId, data),

	delete: async (professionalId: string): Promise<void> =>
		professionalProfileApi.delete(professionalId),

	updateBio: async (data: UpdateBioInput): Promise<ProfessionalResponse> =>
		professionalProfileApi.updateBio(data),

	updateSocialLinks: async (
		data: UpdateSocialLinksInput,
	): Promise<ProfessionalResponse> =>
		professionalProfileApi.updateSocialLinks(data),

	updateCouncil: async (
		data: UpdateCouncilInput,
	): Promise<ProfessionalResponse> =>
		professionalProfileApi.updateCouncil(data),

	updateAddress: async (
		data: UpdateAddressInput,
	): Promise<ProfessionalResponse> =>
		professionalProfileApi.updateAddress(data),

	addEducation: async (
		data: ProfessionalEducationInput,
	): Promise<ProfessionalResponse> =>
		professionalPortfolioApi.addEducation(data),

	updateEducation: async (
		educationId: string,
		data: ProfessionalEducationInput,
	): Promise<ProfessionalResponse> =>
		professionalPortfolioApi.updateEducation(educationId, data),

	deleteEducation: async (educationId: string): Promise<ProfessionalResponse> =>
		professionalPortfolioApi.deleteEducation(educationId),

	addExperience: async (
		data: ProfessionalExperienceInput,
	): Promise<ProfessionalResponse> =>
		professionalPortfolioApi.addExperience(data),

	updateExperience: async (
		experienceId: string,
		data: ProfessionalExperienceInput,
	): Promise<ProfessionalResponse> =>
		professionalPortfolioApi.updateExperience(experienceId, data),

	deleteExperience: async (
		experienceId: string,
	): Promise<ProfessionalResponse> =>
		professionalPortfolioApi.deleteExperience(experienceId),

	addCertificate: async (
		data: ProfessionalCertificateInput,
	): Promise<ProfessionalResponse> =>
		professionalPortfolioApi.addCertificate(data),

	updateCertificate: async (
		certificateId: string,
		data: ProfessionalCertificateInput,
	): Promise<ProfessionalResponse> =>
		professionalPortfolioApi.updateCertificate(certificateId, data),

	deleteCertificate: async (
		certificateId: string,
	): Promise<ProfessionalResponse> =>
		professionalPortfolioApi.deleteCertificate(certificateId),
};
