import { api } from "@/config/api";
import type {
	ApiPage,
	CreateProfessionalInput,
	ProfessionalResponse,
} from "@/lib/schemas/doctor.schema";

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
};
