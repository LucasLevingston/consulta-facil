import { api } from "@/config/api";
import type {
	ClinicResponse,
	CreateClinicInput,
} from "@/lib/schemas/clinic.schema";

export const clinicsApi = {
	getAll: async (): Promise<ClinicResponse[]> => {
		const response = await api.get<ClinicResponse[]>("/clinics");
		return response.data;
	},

	getById: async (id: string): Promise<ClinicResponse> => {
		const response = await api.get<ClinicResponse>(`/clinics/${id}`);
		return response.data;
	},

	getMy: async (): Promise<ClinicResponse[]> => {
		const response = await api.get<ClinicResponse[]>("/clinics/my");
		return response.data;
	},

	getNearby: async (
		lat: number,
		lng: number,
		radiusKm = 50,
	): Promise<ClinicResponse[]> => {
		const response = await api.get<ClinicResponse[]>("/clinics/nearby", {
			params: { lat, lng, radiusKm },
		});
		return response.data;
	},

	create: async (data: CreateClinicInput): Promise<ClinicResponse> => {
		const response = await api.post<ClinicResponse>("/clinics", data);
		return response.data;
	},

	update: async (
		id: string,
		data: CreateClinicInput,
	): Promise<ClinicResponse> => {
		const response = await api.put<ClinicResponse>(`/clinics/${id}`, data);
		return response.data;
	},

	addMember: async (
		clinicId: string,
		professionalProfileId: string,
	): Promise<void> => {
		await api.post(`/clinics/${clinicId}/members/${professionalProfileId}`);
	},

	removeMember: async (
		clinicId: string,
		professionalProfileId: string,
	): Promise<void> => {
		await api.delete(`/clinics/${clinicId}/members/${professionalProfileId}`);
	},
};
