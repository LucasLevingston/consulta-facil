import { api } from "@/config/api";
import type { ApiPage } from "@/lib/schemas/doctor/api-page.schema";
import type { CreateProfessionalInput } from "@/lib/schemas/doctor/create-professional.schema";
import type { ProfessionalCertificateInput } from "@/lib/schemas/doctor/professional-certificate.schema";
import type { ProfessionalEducationInput } from "@/lib/schemas/doctor/professional-education.schema";
import type { ProfessionalExperienceInput } from "@/lib/schemas/doctor/professional-experience.schema";
import type { ProfessionalRating } from "@/lib/schemas/doctor/professional-rating.schema";
import type { ProfessionalResponse } from "@/lib/schemas/doctor/professional-response.schema";
import type { UpdateAddressInput } from "@/lib/schemas/doctor/update-address.schema";
import type { UpdateBioInput } from "@/lib/schemas/doctor/update-bio.schema";
import type { UpdateCouncilInput } from "@/lib/schemas/doctor/update-council.schema";
import type { UpdateSocialLinksInput } from "@/lib/schemas/doctor/update-social-links.schema";

export const professionalsApi = {
	getAll: async (
		page = 0,
		size = 12,
		profession?: string,
		specialty?: string,
		name?: string,
		serviceTitle?: string,
	): Promise<ApiPage<ProfessionalResponse>> => {
		const response = await api.get<ApiPage<ProfessionalResponse>>(
			"/professionals",
			{
				params: {
					page,
					size,
					profession: profession || undefined,
					specialty: specialty || undefined,
					name: name || undefined,
					serviceTitle: serviceTitle || undefined,
				},
			},
		);
		return response.data;
	},

	getById: async (professionalId: string): Promise<ProfessionalResponse> => {
		const response = await api.get<ProfessionalResponse>(
			`/professionals/${professionalId}`,
		);
		return response.data;
	},

	searchBySpecialty: async (
		specialty: string,
		page = 0,
		size = 20,
	): Promise<ApiPage<ProfessionalResponse>> => {
		const response = await api.get<ApiPage<ProfessionalResponse>>(
			"/professionals/search",
			{
				params: { specialty, page, size },
			},
		);
		return response.data;
	},

	create: async (
		data: CreateProfessionalInput,
	): Promise<ProfessionalResponse> => {
		const response = await api.post<ProfessionalResponse>(
			"/professionals",
			data,
		);
		return response.data;
	},

	update: async (
		professionalId: string,
		data: CreateProfessionalInput,
	): Promise<ProfessionalResponse> => {
		const response = await api.put<ProfessionalResponse>(
			`/professionals/${professionalId}`,
			data,
		);
		return response.data;
	},

	delete: async (professionalId: string): Promise<void> => {
		await api.delete(`/professionals/${professionalId}`);
	},

	getPendingApplications: async (
		page = 0,
		size = 20,
	): Promise<ApiPage<ProfessionalResponse>> => {
		const response = await api.get<ApiPage<ProfessionalResponse>>(
			"/professionals/applications",
			{
				params: { page, size },
			},
		);
		return response.data;
	},

	getApplicationStatus: async (): Promise<ProfessionalResponse> => {
		const response = await api.get<ProfessionalResponse>(
			"/professionals/application-status",
		);
		return response.data;
	},

	approve: async (professionalId: string): Promise<ProfessionalResponse> => {
		const response = await api.put<ProfessionalResponse>(
			`/professionals/${professionalId}/approve`,
		);
		return response.data;
	},

	reject: async (professionalId: string): Promise<ProfessionalResponse> => {
		const response = await api.put<ProfessionalResponse>(
			`/professionals/${professionalId}/reject`,
		);
		return response.data;
	},

	getNearby: async (
		lat: number,
		lng: number,
		radiusKm = 50,
		specialty?: string,
		profession?: string,
	): Promise<ProfessionalResponse[]> => {
		const response = await api.get<ProfessionalResponse[]>(
			"/professionals/nearby",
			{
				params: {
					lat,
					lng,
					radiusKm,
					specialty: specialty || undefined,
					profession: profession || undefined,
				},
			},
		);
		return response.data;
	},

	getRatings: async (professionalId: string): Promise<ProfessionalRating> => {
		const response = await api.get<ProfessionalRating>(
			`/professionals/${professionalId}/ratings`,
		);
		return response.data;
	},

	updateBio: async (data: UpdateBioInput): Promise<ProfessionalResponse> => {
		const response = await api.patch<ProfessionalResponse>(
			"/professionals/me/bio",
			data,
		);
		return response.data;
	},

	updateSocialLinks: async (
		data: UpdateSocialLinksInput,
	): Promise<ProfessionalResponse> => {
		const response = await api.patch<ProfessionalResponse>(
			"/professionals/me/social-links",
			data,
		);
		return response.data;
	},

	updateCouncil: async (
		data: UpdateCouncilInput,
	): Promise<ProfessionalResponse> => {
		const response = await api.patch<ProfessionalResponse>(
			"/professionals/me/council",
			data,
		);
		return response.data;
	},

	updateAddress: async (
		data: UpdateAddressInput,
	): Promise<ProfessionalResponse> => {
		const response = await api.patch<ProfessionalResponse>(
			"/professionals/me/address",
			data,
		);
		return response.data;
	},

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
