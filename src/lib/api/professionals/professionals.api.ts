import { api } from "@/config/api";
import type { ApiPage } from "@/lib/schemas/doctor/api-page.schema";
import type { ProfessionalRating } from "@/lib/schemas/doctor/professional-rating.schema";
import type { ProfessionalResponse } from "@/lib/schemas/doctor/professional-response.schema";

export const professionalsListingApi = {
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
			{ params: { specialty, page, size } },
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
};
