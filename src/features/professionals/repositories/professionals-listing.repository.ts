import { professionalsListingApi } from "@/lib/api/professionals/professionals.api";
import type { ApiPage } from "@/lib/schemas/professional/api-page.schema";
import type { ProfessionalRating } from "@/lib/schemas/professional/professional-rating.schema";
import type { ProfessionalResponse } from "@/lib/schemas/professional/professional-response.schema";

export const professionalsListingRepository = {
	getAll: (
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

	getById: (professionalId: string): Promise<ProfessionalResponse> =>
		professionalsListingApi.getById(professionalId),

	searchBySpecialty: (
		specialty: string,
		page = 0,
		size = 20,
	): Promise<ApiPage<ProfessionalResponse>> =>
		professionalsListingApi.searchBySpecialty(specialty, page, size),

	getNearby: (
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

	getRatings: (professionalId: string): Promise<ProfessionalRating> =>
		professionalsListingApi.getRatings(professionalId),
};
