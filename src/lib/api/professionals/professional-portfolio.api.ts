import { api } from "@/config/api";
import type { ProfessionalCertificateInput } from "@/lib/schemas/professional/professional-certificate.schema";
import type { ProfessionalEducationInput } from "@/lib/schemas/professional/professional-education.schema";
import type { ProfessionalExperienceInput } from "@/lib/schemas/professional/professional-experience.schema";
import type { ProfessionalResponse } from "@/lib/schemas/professional/professional-response.schema";

export const professionalPortfolioApi = {
	addEducation: async (
		data: ProfessionalEducationInput,
	): Promise<ProfessionalResponse> => {
		const response = await api.post<ProfessionalResponse>(
			"/professionals/me/education",
			data,
		);
		return response.data;
	},

	updateEducation: async (
		educationId: string,
		data: ProfessionalEducationInput,
	): Promise<ProfessionalResponse> => {
		const response = await api.put<ProfessionalResponse>(
			`/professionals/me/education/${educationId}`,
			data,
		);
		return response.data;
	},

	deleteEducation: async (
		educationId: string,
	): Promise<ProfessionalResponse> => {
		const response = await api.delete<ProfessionalResponse>(
			`/professionals/me/education/${educationId}`,
		);
		return response.data;
	},

	addExperience: async (
		data: ProfessionalExperienceInput,
	): Promise<ProfessionalResponse> => {
		const response = await api.post<ProfessionalResponse>(
			"/professionals/me/experience",
			data,
		);
		return response.data;
	},

	updateExperience: async (
		experienceId: string,
		data: ProfessionalExperienceInput,
	): Promise<ProfessionalResponse> => {
		const response = await api.put<ProfessionalResponse>(
			`/professionals/me/experience/${experienceId}`,
			data,
		);
		return response.data;
	},

	deleteExperience: async (
		experienceId: string,
	): Promise<ProfessionalResponse> => {
		const response = await api.delete<ProfessionalResponse>(
			`/professionals/me/experience/${experienceId}`,
		);
		return response.data;
	},

	addCertificate: async (
		data: ProfessionalCertificateInput,
	): Promise<ProfessionalResponse> => {
		const response = await api.post<ProfessionalResponse>(
			"/professionals/me/certificates",
			data,
		);
		return response.data;
	},

	updateCertificate: async (
		certificateId: string,
		data: ProfessionalCertificateInput,
	): Promise<ProfessionalResponse> => {
		const response = await api.put<ProfessionalResponse>(
			`/professionals/me/certificates/${certificateId}`,
			data,
		);
		return response.data;
	},

	deleteCertificate: async (
		certificateId: string,
	): Promise<ProfessionalResponse> => {
		const response = await api.delete<ProfessionalResponse>(
			`/professionals/me/certificates/${certificateId}`,
		);
		return response.data;
	},
};
