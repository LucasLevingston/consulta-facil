import { getMyProfessionalProfileApi } from "@/lib/api/professionals/my-professional-profile.api";
import { professionalApplicationsApi } from "@/lib/api/professionals/professional-applications.api";
import { professionalsListingApi } from "@/lib/api/professionals/professionals.api";
import type { ApiPage } from "@/lib/schemas/doctor/api-page.schema";
import type { CreateProfessionalInput } from "@/lib/schemas/doctor/create-professional.schema";
import type { ProfessionalRating } from "@/lib/schemas/doctor/professional-rating.schema";
import type { ProfessionalResponse } from "@/lib/schemas/doctor/professional-response.schema";

export const professionalsListingRepo = {
	getMe: async (): Promise<ProfessionalResponse> =>
		getMyProfessionalProfileApi(),

	getAll: async (
		page = 0,
		size = 12,
		profession?: string,
		specialty?: string,
		name?: string,
		serviceTitle?: string,
	): Promise<ApiPage<ProfessionalResponse>> =>
		professionalsListingApi.getAll(
			page,
			size,
			profession,
			specialty,
			name,
			serviceTitle,
		),

	getById: async (id: string): Promise<ProfessionalResponse> =>
		professionalsListingApi.getById(id),

	searchBySpecialty: async (
		specialty: string,
		page = 0,
		size = 20,
	): Promise<ApiPage<ProfessionalResponse>> =>
		professionalsListingApi.searchBySpecialty(specialty, page, size),

	getNearby: async (
		lat: number,
		lng: number,
		radiusKm = 50,
		specialty?: string,
		profession?: string,
	): Promise<ProfessionalResponse[]> =>
		professionalsListingApi.getNearby(
			lat,
			lng,
			radiusKm,
			specialty,
			profession,
		),

	getRatings: async (professionalId: string): Promise<ProfessionalRating> =>
		professionalsListingApi.getRatings(professionalId),

	createApplication: async (
		data: CreateProfessionalInput,
	): Promise<ProfessionalResponse> => professionalApplicationsApi.create(data),

	getPendingApplications: async (
		page = 0,
		size = 20,
	): Promise<ApiPage<ProfessionalResponse>> =>
		professionalApplicationsApi.getPendingApplications(page, size),

	getApplicationStatus: async (): Promise<ProfessionalResponse> =>
		professionalApplicationsApi.getApplicationStatus(),

	approveApplication: async (
		professionalId: string,
	): Promise<ProfessionalResponse> =>
		professionalApplicationsApi.approve(professionalId),

	rejectApplication: async (
		professionalId: string,
	): Promise<ProfessionalResponse> =>
		professionalApplicationsApi.reject(professionalId),
};
